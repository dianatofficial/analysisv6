
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AIService } from '../services/ai.service';
import { HistoryService } from '../services/history.service';
import { ConfigService } from '../services/config.service';
import { LoaderComponent } from './ui/loader.component';
import { IconComponent } from './ui/icon.component';
import { AnalysisInputs, HistoryRecord } from '../models/types';

type FieldKey = 'subject' | 'question' | 'facts' | 'actors' | 'constraints' | 'issue' | 'resources';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-analysis',
  imports: [FormsModule, LoaderComponent, LucideAngularModule],
  template: `
    <div class="w-full max-w-6xl mx-auto px-4 py-4">
      
      @if (loading()) {
        <app-loader></app-loader>
      }

      <div class="animate-fade-in-up">
        
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-xl sm:text-2xl font-bold text-black tracking-tight">تحلیل استراتژیک</h1>
          <p class="text-slate-500 text-xs mt-0.5">تعریف پارامترهای مسئله برای پردازش هوشمند</p>
        </div>

        <!-- Keywords Input -->
        <div class="minimal-card p-6 sm:p-8 mb-6">
           <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">کلیدواژه‌های اصلی (برای پیشنهاد هوشمند)</label>
              <input type="text" [(ngModel)]="keywords" placeholder="مثال: هوش مصنوعی، آینده شغلی، تحول دیجیتال" class="w-full text-sm font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-black outline-none transition-all">
              <p class="text-[10px] text-slate-400 mt-1">کلیدواژه‌ها را با کاما (,)، فاصله یا علامت مثبت (+) از هم جدا کنید.</p>
           </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Main Inputs (8 cols) -->
          <div class="lg:col-span-8 space-y-6">
             
             <!-- Dynamic Form Card -->
             <div class="minimal-card p-6 sm:p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  @for (field of config().analysisFields; track field.id) {
                    <div [class]="field.width === 'full' ? 'md:col-span-2' : ''" class="space-y-1.5">
                      <div class="flex justify-between items-center">
                        <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {{ field.label }}
                          @if (field.required) { <span class="text-red-500">*</span> }
                        </label>
                        
                        @if (field.type === 'text' || field.type === 'textarea') {
                          <button (click)="generateSmartField(field.id)" [disabled]="isGenerating(field.id)" class="text-black hover:bg-slate-100 p-1 rounded transition-colors disabled:opacity-50" title="تولید هوشمند">
                            @if (isGenerating(field.id)) { <span class="block w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> } 
                            @else { <lucide-icon name="sparkles" class="w-3 h-3"></lucide-icon> }
                          </button>
                        }
                      </div>

                      @switch (field.type) {
                        @case ('text') {
                          <input type="text" [(ngModel)]="formData[field.id]" [placeholder]="field.placeholder || ''" class="w-full text-sm font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-black outline-none transition-all">
                        }
                        @case ('textarea') {
                          <textarea [(ngModel)]="formData[field.id]" [placeholder]="field.placeholder || ''" rows="3" class="w-full text-sm font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-black outline-none transition-all leading-relaxed"></textarea>
                        }
                        @case ('select') {
                          <div class="relative">
                            <select [(ngModel)]="formData[field.id]" class="w-full text-sm font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-black outline-none appearance-none cursor-pointer">
                              @for (opt of field.options; track opt) { <option [value]="opt">{{opt}}</option> }
                            </select>
                            <lucide-icon name="chevron-down" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 pointer-events-none"></lucide-icon>
                          </div>
                        }
                        @case ('boolean') {
                          <label class="flex items-center gap-3 cursor-pointer p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                            <input type="checkbox" [(ngModel)]="formData[field.id]" class="w-4 h-4 rounded border-slate-300 text-black focus:ring-black">
                            <span class="text-xs font-bold text-slate-600">{{ field.label }} فعال باشد</span>
                          </label>
                        }
                      }
                    </div>
                  }
                </div>
             </div>
          </div>

          <!-- Settings Column (4 cols) -->
          <div class="lg:col-span-4 space-y-6">
             
             <div class="minimal-card p-6 sticky top-24">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pb-3 border-b border-slate-100">تنظیمات خروجی</h3>

                <div class="space-y-4">
                   
                   <!-- Toggles -->
                   <div class="space-y-3">
                      <label class="flex items-center justify-between cursor-pointer group">
                         <span class="text-xs font-bold text-slate-600">جداول مقایسه‌ای</span>
                         <div class="relative flex items-center">
                            <input type="checkbox" [(ngModel)]="formData.includeTables" class="peer sr-only">
                            <div class="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-black"></div>
                         </div>
                      </label>

                      <label class="flex items-center justify-between cursor-pointer group">
                         <span class="text-xs font-bold text-slate-600">نمودار SWOT</span>
                         <div class="relative flex items-center">
                            <input type="checkbox" [(ngModel)]="formData.includeCharts" class="peer sr-only">
                            <div class="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-black"></div>
                         </div>
                      </label>
                   </div>

                </div>

                <div class="mt-6 pt-4 border-t border-slate-100">
                   <button 
                      (click)="onSubmit()"
                      [disabled]="!isValid"
                      class="w-full py-3 bg-black text-white rounded-lg font-bold text-sm shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                      <span>پردازش نهایی</span>
                      <lucide-icon name="sparkles" class="w-4 h-4"></lucide-icon>
                   </button>
                   @if (!isValid) {
                     <p class="text-center text-red-500 text-[9px] font-bold mt-2">تکمیل تمامی موارد ستاره‌دار الزامی است</p>
                   }
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class AnalysisComponent implements OnInit {
  private aiService = inject(AIService);
  private historyService = inject(HistoryService);
  private configService = inject(ConfigService);
  private router = inject(Router);
  
  config = this.configService.config;

  keywords = signal('');
  
  fieldLoading = signal<Record<string, boolean>>({});
  
  // DTO Initialization - Now dynamic
  formData: AnalysisInputs = {} as AnalysisInputs;

  loading = signal(false);
  historyList = signal<HistoryRecord[]>([]);

  get isValid() {
    // Check all required dynamic fields
    return this.config().analysisFields
      .filter(f => f.required)
      .every(f => !!this.formData[f.id]);
  }

  ngOnInit() {
    // Initialize form with default values from config
    this.config().analysisFields.forEach(f => {
      this.formData[f.id] = f.defaultValue || (f.type === 'boolean' ? false : (f.type === 'select' ? f.options?.[0] : ''));
    });
  }

  isGenerating(fieldId: string) {
    return this.fieldLoading()[fieldId] || false;
  }

  setFieldLoading(fieldId: string, state: boolean) {
    this.fieldLoading.update(current => ({ ...current, [fieldId]: state }));
  }

  // --- Smart Gen Methods ---

  async generateSmartField(fieldId: string) {
    this.setFieldLoading(fieldId, true);
    try {
      // Use 'subject' as context if available, otherwise use keywords if it's the subject field
      const context = fieldId === 'subject' ? this.keywords() : (this.formData.subject || this.keywords());
      
      if (!context) {
        this.setFieldLoading(fieldId, false);
        return;
      }

      const result = await this.aiService.generateSmartField(fieldId as FieldKey, context, 'generate', this.formData.domain || 'عمومی');
      
      if (result) {
        this.formData[fieldId] = result;
      }
    } finally {
      this.setFieldLoading(fieldId, false);
    }
  }

  async refineText(fieldId: string, action: 'enrich' | 'summarize' | 'expand') {
    const currentText = this.formData[fieldId];
    if (!currentText) return;

    this.setFieldLoading(fieldId, true);
    try {
      const result = await this.aiService.generateSmartField(fieldId as FieldKey, currentText, action, this.formData.domain || 'عمومی');
      if (result) {
         this.formData[fieldId] = result;
      }
    } finally {
       this.setFieldLoading(fieldId, false);
    }
  }

  async onSubmit() {
    if (!this.isValid) return; 
    
    this.loading.set(true);
    
    try {
      // Ensure we pass a clean object to the service
      const response = await this.aiService.generateAnalysis(this.formData as AnalysisInputs);
      
      if (response && !response.includes('خطا')) {
        const record = await this.historyService.saveAnalysis(this.formData as AnalysisInputs, response);
        this.router.navigate(['/analysis/result', record.id]);
      } else {
         alert('خطا در پردازش اطلاعات. لطفا مجدد تلاش کنید.');
      }
    } catch (e) {
      console.error(e);
      alert('خطا در برقراری ارتباط با سرور.');
    } finally {
      this.loading.set(false);
    }
  }
}
