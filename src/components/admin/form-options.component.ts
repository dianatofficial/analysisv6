
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { FormOptions } from '../../models/types';
import { IconComponent } from '../ui/icon.component';

interface FormSectionDef {
  key: keyof FormOptions;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
}

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-form-options',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-10 animate-fade-in">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
         @for (section of formSections; track section.key) {
            <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-indigo-600 transition-colors"></div>
              
              <!-- Card Header -->
              <div class="flex items-start justify-between mb-8 pb-6 border-b border-slate-50 relative z-10">
                <div class="flex gap-5">
                  <div [class]="'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 ' + section.colorClass">
                     <lucide-icon [name]="section.icon" class="w-7 h-7 text-white"></lucide-icon>
                  </div>
                  <div>
                     <h4 class="font-black text-xl text-slate-900 tracking-tight">{{ section.title }}</h4>
                     <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{{ section.description }}</p>
                  </div>
                </div>
                <span class="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-xl text-[10px] font-black border border-slate-100 uppercase tracking-tighter">
                   {{ config().formOptions[section.key].length }} ITEMS
                </span>
              </div>

              <!-- Tag List -->
              <div class="flex flex-wrap gap-3 mb-10 flex-grow content-start relative z-10">
                 @for (item of config().formOptions[section.key]; track item) {
                   <div class="group/tag inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-black text-xs hover:bg-white hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md transition-all cursor-default select-none animate-fade-in relative overflow-hidden">
                      <div class="absolute inset-y-0 right-0 w-0.5 bg-indigo-600 opacity-0 group-hover/tag:opacity-100 transition-opacity"></div>
                      <span>{{ item }}</span>
                      <button (click)="removeFromArray(section.key, item)" class="text-slate-300 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50">
                         <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
                      </button>
                   </div>
                 }
                 @if (config().formOptions[section.key].length === 0) {
                   <div class="w-full text-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                      <lucide-icon name="list" class="w-10 h-10 text-slate-200 mx-auto mb-3"></lucide-icon>
                      <p class="text-xs text-slate-400 font-black uppercase tracking-widest">لیست خالی است</p>
                   </div>
                 }
              </div>

              <!-- Add Input -->
              <div class="mt-auto relative z-10">
                <div class="flex gap-3 relative group/input">
                   <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors">
                      <lucide-icon name="plus" class="w-5 h-5"></lucide-icon>
                   </div>
                   <input 
                     #newItemInput 
                     type="text" 
                     class="flex-1 pr-12 pl-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all font-bold text-sm text-slate-800 placeholder:text-slate-400 shadow-inner" 
                     [placeholder]="'افزودن به ' + section.title + '...'" 
                     (keydown.enter)="addToArray(section.key, newItemInput)"
                   >
                   <button (click)="addToArray(section.key, newItemInput)" class="px-6 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                      <span class="font-black text-xs uppercase">افزودن</span>
                   </button>
                </div>
              </div>
            </div>
         }
      </div>

      <div class="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-200">
         <div class="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <lucide-icon name="sliders-horizontal" class="w-6 h-6 text-indigo-600"></lucide-icon>
            <p class="text-[11px] font-bold text-indigo-700">
               تغییرات در داده‌های پایه بلافاصله در تمامی فرم‌های سامانه (تحلیل و سناریو) اعمال خواهد شد.
            </p>
         </div>
         
         <button (click)="saveConfig()" class="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4">
            <lucide-icon name="check-circle" class="w-7 h-7"></lucide-icon>
            <span>ذخیره نهایی تغییرات پایگاه داده</span>
         </button>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class FormOptionsComponent {
  configService = inject(ConfigService);
  config = this.configService.config;

  formSections: FormSectionDef[] = [
    { key: 'analysisDomains', title: 'حوزه‌های تحلیل', description: 'دسته‌بندی‌های اصلی برای گزارش‌های تحلیلی', icon: 'analysis', colorClass: 'bg-indigo-500' },
    { key: 'analysisDepths', title: 'عمق و سطح تحلیل', description: 'گزینه‌های مربوط به میزان جزئیات خروجی', icon: 'document', colorClass: 'bg-blue-500' },
    { key: 'scenarioDomains', title: 'حوزه‌های بحران', description: 'دسته‌بندی‌های مربوط به سناریونگاری', icon: 'scenario', colorClass: 'bg-orange-500' },
    { key: 'scenarioStatuses', title: 'وضعیت‌های بحران', description: 'مراحل مختلف چرخه حیات بحران', icon: 'shield-exclamation', colorClass: 'bg-red-500' },
    { key: 'scenarioRisks', title: 'سطوح ریسک', description: 'گزینه‌های تحمل ریسک عملیاتی', icon: 'adjust', colorClass: 'bg-teal-500' },
  ];

  addToArray(key: keyof FormOptions, input: HTMLInputElement) {
    const value = input.value.trim();
    if (!value) return;

    const currentOptions = { ...this.config().formOptions };
    const list = currentOptions[key] as string[];
    
    if (!list.includes(value)) {
      currentOptions[key] = [...list, value];
      this.configService.updateConfig({ formOptions: currentOptions });
    }
    input.value = '';
    input.focus();
  }

  removeFromArray(key: keyof FormOptions, item: string) {
    if (!confirm(`آیا از حذف "${item}" مطمئن هستید؟`)) return;

    const currentOptions = { ...this.config().formOptions };
    const list = currentOptions[key] as string[];
    
    currentOptions[key] = list.filter(x => x !== item);
    this.configService.updateConfig({ formOptions: currentOptions });
  }

  saveConfig() {
    this.configService.updateConfig({});
  }
}
