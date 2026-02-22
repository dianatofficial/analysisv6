
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConfigService } from '../../services/config.service';
import { IconComponent } from '../ui/icon.component';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-general-settings',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, DatePipe],
  template: `
    <div class="max-w-5xl mx-auto animate-fade-in pt-4 space-y-12">
      
      <!-- System Identity -->
      <div class="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
         <div class="absolute top-0 right-0 w-full h-2 bg-indigo-600"></div>
         <div class="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none opacity-50"></div>
         
         <div class="relative z-10">
            <div class="flex items-center gap-4 mb-12">
               <div class="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                  <lucide-icon name="sliders-horizontal" class="w-7 h-7"></lucide-icon>
               </div>
               <div>
                  <h3 class="text-2xl font-black text-slate-900 tracking-tight">هویت بصری و برندینگ</h3>
                  <p class="text-slate-400 text-sm font-bold mt-1">شخصی‌سازی نام، لوگو و تم رنگی سامانه</p>
               </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">نام سامانه (Application Title)</label>
                  <input type="text" [(ngModel)]="localConfig.appName" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-black text-slate-800 shadow-inner">
               </div>

               <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">متن لوگو (Logo Text)</label>
                  <input type="text" [(ngModel)]="localConfig.logoText" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-black text-slate-800 ltr text-left shadow-inner">
               </div>

               <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">رنگ سازمانی (Primary Theme Color)</label>
                  <div class="flex gap-4">
                     <div class="relative group">
                        <input type="color" [(ngModel)]="localConfig.themeColor" class="w-16 h-16 p-1 bg-white border border-slate-200 rounded-2xl cursor-pointer shadow-sm">
                        <div class="absolute inset-0 rounded-2xl border-2 border-white pointer-events-none"></div>
                     </div>
                     <input type="text" [(ngModel)]="localConfig.themeColor" class="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono font-black text-slate-600 ltr text-left shadow-inner focus:bg-white focus:border-indigo-500 outline-none transition-all">
                  </div>
               </div>

               <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">متن کپی‌رایت فوتر</label>
                  <input type="text" [(ngModel)]="localConfig.footerText" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-black text-slate-800 shadow-inner">
               </div>
            </div>
         </div>
      </div>

      <!-- System Controls -->
      <div class="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
         <div class="absolute top-0 right-0 w-full h-2 bg-amber-500"></div>
         
         <div class="relative z-10">
            <div class="flex items-center gap-4 mb-12">
               <div class="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-xl">
                  <lucide-icon name="cpu" class="w-7 h-7"></lucide-icon>
               </div>
               <div>
                  <h3 class="text-2xl font-black text-slate-900 tracking-tight">کنترل‌های عملیاتی سیستم</h3>
                  <p class="text-slate-400 text-sm font-bold mt-1">مدیریت دسترسی‌های پایه و وضعیت نگهداری</p>
               </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               <div class="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-500">
                  <div class="flex items-center gap-5">
                     <div class="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                        <lucide-icon name="shield-alert" class="w-6 h-6"></lucide-icon>
                     </div>
                     <div>
                        <h4 class="font-black text-slate-800">وضعیت تعمیر و نگهداری</h4>
                        <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Maintenance Mode</p>
                     </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" [(ngModel)]="localConfig.maintenanceMode" class="sr-only peer">
                     <div class="w-16 h-9 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-rose-500 shadow-inner"></div>
                  </label>
               </div>

               <div class="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
                  <div class="flex items-center gap-5">
                     <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <lucide-icon name="user-plus" class="w-6 h-6"></lucide-icon>
                     </div>
                     <div>
                        <h4 class="font-black text-slate-800">ثبت‌نام آزاد کاربران</h4>
                        <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Open Registration</p>
                     </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" [(ngModel)]="localConfig.allowRegistration" class="sr-only peer">
                     <div class="w-16 h-9 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                  </label>
               </div>

            </div>
         </div>
      </div>

      <!-- System Logs -->
      <div class="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
         <div class="absolute top-0 right-0 w-full h-2 bg-slate-400"></div>
         
         <div class="relative z-10">
            <div class="flex items-center justify-between mb-12">
               <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                     <lucide-icon name="list" class="w-7 h-7"></lucide-icon>
                  </div>
                  <div>
                     <h3 class="text-2xl font-black text-slate-900 tracking-tight">گزارشات سیستمی</h3>
                     <p class="text-slate-400 text-sm font-bold mt-1">پایش لحظه‌ای رویدادهای هسته سامانه</p>
                  </div>
               </div>
               <button (click)="refreshLogs()" class="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all border border-slate-100 hover:border-indigo-100 shadow-sm group">
                  <lucide-icon name="rotate-cw" class="w-6 h-6 group-active:rotate-180 transition-transform duration-500"></lucide-icon>
               </button>
            </div>
            
            <div class="space-y-4">
               @for (log of systemLogs(); track log.id) {
                  <div class="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                     <div class="flex items-center gap-4 shrink-0">
                        <span class="font-mono text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-100">{{ log.time | date:'HH:mm:ss' }}</span>
                        <span [class]="getLogBadgeClass(log.type)" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border">
                           {{ log.type }}
                        </span>
                     </div>
                     <span class="font-black text-slate-700 flex-1 text-sm">{{ log.message }}</span>
                     <div class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase bg-white px-3 py-1 rounded-lg border border-slate-100">
                        <lucide-icon name="user" class="w-3 h-3"></lucide-icon>
                        {{ log.user }}
                     </div>
                  </div>
               }
            </div>
         </div>
      </div>

      <!-- Save Action -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-200">
         <div class="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 max-w-xl">
            <lucide-icon name="sliders-horizontal" class="w-6 h-6 text-indigo-600"></lucide-icon>
            <p class="text-[11px] font-bold text-indigo-700">
               تغییرات در هویت بصری و تنظیمات عملیاتی بلافاصله برای تمامی کاربران سامانه اعمال خواهد شد.
            </p>
         </div>
         
         <button (click)="saveConfig()" class="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4">
            <lucide-icon name="check-circle" class="w-7 h-7"></lucide-icon>
            <span>ذخیره و اعمال سراسری تنظیمات</span>
         </button>
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
export class GeneralSettingsComponent {
  configService = inject(ConfigService);
  config = this.configService.config;
  
  localConfig = { ...this.config() };

  systemLogs = signal([
    { id: 1, time: new Date(), type: 'INFO', message: 'تنظیمات هوش مصنوعی به‌روزرسانی شد', user: 'sadmin' },
    { id: 2, time: new Date(Date.now() - 3600000), type: 'WARN', message: 'تلاش ناموفق برای ورود به سیستم', user: '192.168.1.45' },
    { id: 3, time: new Date(Date.now() - 7200000), type: 'AUTH', message: 'کاربر جدید ایجاد شد: analyst_01', user: 'admin' },
    { id: 4, time: new Date(Date.now() - 86400000), type: 'SYSTEM', message: 'هسته پردازش استراتژیک راه‌اندازی شد', user: 'SYSTEM' }
  ]);

  getLogBadgeClass(type: string) {
    switch(type) {
      case 'INFO': return 'bg-blue-100 text-blue-700';
      case 'WARN': return 'bg-amber-100 text-amber-700';
      case 'AUTH': return 'bg-emerald-100 text-emerald-700';
      case 'SYSTEM': return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  refreshLogs() {
    // Mock refresh
    const newLog = { 
      id: Date.now(), 
      time: new Date(), 
      type: 'INFO', 
      message: 'گزارشات سیستمی بازخوانی شد', 
      user: 'sadmin' 
    };
    this.systemLogs.update(logs => [newLog, ...logs.slice(0, 4)]);
  }

  saveConfig() {
    this.configService.updateConfig(this.localConfig);
    alert('تنظیمات با موفقیت ذخیره شد.');
  }
}
