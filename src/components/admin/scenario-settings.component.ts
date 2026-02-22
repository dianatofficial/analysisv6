
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { DynamicField } from '../../models/types';
import { IconComponent } from '../ui/icon.component';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-scenario-settings',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in">
      
      <!-- Editor Column -->
      <div class="xl:col-span-8 space-y-6">
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
            <div>
              <h3 class="text-2xl font-black text-slate-900 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                  <lucide-icon name="sparkles" class="w-6 h-6"></lucide-icon>
                </div>
                ساختار فرم سناریونگاری
              </h3>
              <p class="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">مدیریت فیلدهای ورودی و منطق فرم</p>
            </div>
            <button (click)="addField()" class="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl hover:bg-amber-600 transition-all flex items-center gap-2 active:scale-95">
              <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
              <span>افزودن فیلد جدید</span>
            </button>
          </div>

          <div class="space-y-4">
            @for (field of fields(); track field.id; let i = $index) {
              <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-amber-200 hover:bg-white transition-all duration-300 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-1 h-full bg-slate-200 group-hover:bg-amber-500 transition-colors"></div>
                
                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  <!-- Order & Drag Handle -->
                  <div class="md:col-span-1 flex flex-col items-center gap-2 pt-2">
                     <span class="text-[10px] font-black text-slate-300">#{{ i + 1 }}</span>
                     <div class="flex flex-col gap-1">
                        <button (click)="moveField(i, -1)" [disabled]="i === 0" class="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-20 transition-colors">
                          <lucide-icon name="chevron-up" class="w-4 h-4"></lucide-icon>
                        </button>
                        <button (click)="moveField(i, 1)" [disabled]="i === fields().length - 1" class="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-20 transition-colors">
                          <lucide-icon name="chevron-down" class="w-4 h-4"></lucide-icon>
                        </button>
                     </div>
                  </div>

                  <!-- Field Config -->
                  <div class="md:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div class="space-y-1.5">
                      <label class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">شناسه فیلد (ID)</label>
                      <input type="text" [(ngModel)]="field.id" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-[10px] ltr text-left focus:border-amber-500 outline-none transition-all">
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">عنوان نمایشی</label>
                      <input type="text" [(ngModel)]="field.label" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs focus:border-amber-500 outline-none transition-all">
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">نوع ورودی</label>
                      <select [(ngModel)]="field.type" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer">
                        <option value="text">متن کوتاه</option>
                        <option value="textarea">متن طولانی</option>
                        <option value="select">انتخابی (Dropdown)</option>
                        <option value="number">عدد</option>
                        <option value="boolean">بله/خیر</option>
                      </select>
                    </div>
                    
                    @if (field.type === 'select') {
                      <div class="md:col-span-3 space-y-1.5">
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">گزینه‌ها (با کاما جدا کنید)</label>
                        <input type="text" [ngModel]="field.options?.join(', ')" (ngModelChange)="updateOptions(field, $event)" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs focus:border-amber-500 outline-none transition-all" placeholder="گزینه ۱, گزینه ۲, ...">
                      </div>
                    }

                    <div class="md:col-span-3 flex flex-wrap items-center gap-8 pt-2">
                      <label class="flex items-center gap-3 cursor-pointer group/check">
                        <div class="relative flex items-center">
                          <input type="checkbox" [(ngModel)]="field.required" class="peer sr-only">
                          <div class="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-amber-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-5"></div>
                        </div>
                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/check:text-amber-600 transition-colors">اجباری</span>
                      </label>

                      <div class="flex items-center gap-3">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">عرض فیلد:</span>
                        <div class="flex p-1 bg-white border border-slate-200 rounded-lg">
                           <button (click)="field.width = 'half'" [class]="field.width === 'half' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-600'" class="px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all">Half</button>
                           <button (click)="field.width = 'full'" [class]="field.width === 'full' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-600'" class="px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all">Full</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="md:col-span-1 flex justify-end">
                     <button (click)="removeField(i)" class="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <lucide-icon name="trash-2" class="w-5 h-5"></lucide-icon>
                     </button>
                  </div>

                </div>
              </div>
            }
          </div>

          <div class="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
            <button (click)="resetToDefault()" class="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center gap-2">
              <lucide-icon name="rotate-cw" class="w-4 h-4"></lucide-icon>
              <span>بازنشانی به تنظیمات اولیه</span>
            </button>
            <button (click)="saveChanges()" class="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/20 transition-all active:scale-95 flex items-center gap-3">
              <span>ذخیره نهایی ساختار فرم</span>
              <lucide-icon name="check-circle" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Column -->
      <div class="xl:col-span-4">
        <div class="sticky top-24 space-y-6">
          <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
             <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
             <div class="relative z-10">
                <h4 class="text-xs font-black uppercase tracking-[0.3em] text-amber-400 mb-4">پیش‌نمایش زنده</h4>
                <div class="space-y-6">
                   <div class="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                      <div class="grid grid-cols-2 gap-4">
                        @for (field of fields(); track field.id) {
                          <div [class]="field.width === 'full' ? 'col-span-2' : 'col-span-1'" class="space-y-2">
                             <label class="text-[10px] font-black text-white/50 uppercase tracking-widest">{{ field.label }}</label>
                             @if (field.type === 'textarea') {
                                <div class="w-full h-16 bg-white/10 border border-white/20 rounded-lg"></div>
                             } @else if (field.type === 'select') {
                                <div class="relative w-full h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-between px-3">
                                   <span class="text-white/40 text-xs">انتخاب کنید...</span>
                                   <lucide-icon name="chevron-down" class="w-3 h-3 text-white/40"></lucide-icon>
                                </div>
                             } @else if (field.type === 'boolean') {
                                <div class="relative inline-flex items-center cursor-pointer">
                                   <input type="checkbox" class="sr-only peer">
                                   <div class="w-10 h-5 bg-white/20 rounded-full peer peer-checked:bg-amber-400 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-5"></div>
                                </div>
                             } @else {
                                <div class="w-full h-9 bg-white/10 border border-white/20 rounded-lg"></div>
                             }
                          </div>
                        }
                      </div>
                   </div>
                   <div class="flex items-center gap-3 text-[10px] font-bold text-slate-400 leading-relaxed">
                      <lucide-icon name="info" class="w-5 h-5 text-amber-400 shrink-0"></lucide-icon>
                      <span>این یک نمای شماتیک از فرم نهایی است. تغییرات شما بلافاصله در بخش سناریونگاری اعمال خواهد شد.</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div class="bg-amber-50 rounded-[2rem] p-6 border border-amber-100">
             <h5 class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">نکته امنیتی</h5>
             <p class="text-[11px] text-amber-800 font-bold leading-relaxed">
                تغییر شناسه (ID) فیلدهایی که قبلاً دارای داده هستند، ممکن است باعث عدم نمایش صحیح سوابق قدیمی در بخش پروفایل شود. با احتیاط تغییر دهید.
             </p>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .ltr { direction: ltr; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ScenarioSettingsComponent {
  configService = inject(ConfigService);
  fields = signal<DynamicField[]>([...this.configService.config().scenarioFields]);

  addField() {
    const newField: DynamicField = {
      id: 'field_' + Math.random().toString(36).substring(2, 9),
      label: 'فیلد جدید',
      type: 'text',
      required: false,
      order: this.fields().length + 1,
      width: 'full'
    };
    this.fields.update(f => [...f, newField]);
  }

  removeField(index: number) {
    if (confirm('آیا از حذف این فیلد اطمینان دارید؟ داده‌های مرتبط در فرم‌های جدید نمایش داده نخواهند شد.')) {
      this.fields.update(f => f.filter((_, i) => i !== index));
    }
  }

  moveField(index: number, direction: number) {
    const newFields = [...this.fields()];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    
    // Update order property
    newFields.forEach((f, i) => f.order = i + 1);
    this.fields.set(newFields);
  }

  updateOptions(field: DynamicField, value: string) {
    field.options = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  resetToDefault() {
    this.configService.resetToDefaults();
  }

  saveChanges() {
    this.configService.updateConfig({ scenarioFields: this.fields() });
    alert('ساختار فرم سناریونگاری با موفقیت به‌روزرسانی شد.');
  }
}
