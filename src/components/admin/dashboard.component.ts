
import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HistoryService } from '../../services/history.service';
import { ConfigService } from '../../services/config.service';
import { IconComponent } from '../ui/icon.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [IconComponent, DatePipe],
  template: `
    <div class="space-y-10 animate-fade-in">
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-6">
              <div class="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                <app-icon name="users" class="w-7 h-7"></app-icon>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">+۱۲٪</span>
                <span class="text-[8px] font-bold text-slate-400 mt-1 uppercase">رشد ماهانه</span>
              </div>
            </div>
            <h4 class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">کل کاربران سامانه</h4>
            <p class="text-4xl font-black text-slate-900 tracking-tighter">{{ authService.users().length }}</p>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 transition-all group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-6">
              <div class="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 group-hover:rotate-6 transition-transform">
                <app-icon name="analysis" class="w-7 h-7"></app-icon>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">+۵٪</span>
                <span class="text-[8px] font-bold text-slate-400 mt-1 uppercase">رشد ماهانه</span>
              </div>
            </div>
            <h4 class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">تحلیل‌های استراتژیک</h4>
            <p class="text-4xl font-black text-slate-900 tracking-tighter">{{ historyService.history().length }}</p>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-6">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform">
                <app-icon name="cpu-chip" class="w-7 h-7"></app-icon>
              </div>
              <span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">فعال</span>
            </div>
            <h4 class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">مدل هوش مصنوعی</h4>
            <p class="text-xl font-black text-slate-900 uppercase tracking-tight">{{ configService.config().aiConfig.activeProvider }}</p>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-6">
              <div class="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200 group-hover:rotate-6 transition-transform">
                <app-icon name="shield-exclamation" class="w-7 h-7"></app-icon>
              </div>
              <span class="text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">امن</span>
            </div>
            <h4 class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">امنیت و هشدارها</h4>
            <p class="text-4xl font-black text-slate-900 tracking-tighter">۰</p>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Recent Activity -->
        <div class="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div class="flex items-center gap-3">
               <div class="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
               <h3 class="text-xl font-black text-slate-800">فعالیت‌های اخیر سیستم</h3>
            </div>
            <button class="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-indigo-100">مشاهده همه گزارشات</button>
          </div>
          <div class="divide-y divide-slate-50 flex-1">
            @for (item of historyService.history().slice(0, 6); track item.id) {
              <div class="p-6 flex items-center gap-5 hover:bg-slate-50/80 transition-all group cursor-pointer">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <app-icon [name]="item.type === 'analysis' ? 'analysis' : 'sparkles'" class="w-6 h-6"></app-icon>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span [class]="item.type === 'analysis' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'" class="text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                      {{ item.type === 'analysis' ? 'Analysis' : 'Scenario' }}
                    </span>
                    <p class="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {{ item.inputs.subject || item.inputs.issue }}
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <p class="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <app-icon name="clock" class="w-3 h-3"></app-icon>
                      {{ item.timestamp | date:'HH:mm' }}
                    </p>
                    <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <p class="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <app-icon name="user" class="w-3 h-3"></app-icon>
                      کاربر: {{ item.userId || 'سیستم' }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                   <div class="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      COMPLETED
                   </div>
                   <app-icon name="chevron-left" class="w-4 h-4 text-slate-300 group-hover:translate-x-[-4px] transition-transform"></app-icon>
                </div>
              </div>
            }
            @if (historyService.history().length === 0) {
              <div class="p-20 text-center">
                 <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <app-icon name="list-bullet" class="w-10 h-10 text-slate-200"></app-icon>
                 </div>
                 <h4 class="text-lg font-black text-slate-400">فعالیتی ثبت نشده است</h4>
                 <p class="text-sm text-slate-300 font-bold mt-1">سیستم در انتظار اولین عملیات است</p>
              </div>
            }
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 space-y-8 flex flex-col">
          <div class="flex items-center gap-3">
             <div class="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
             <h3 class="text-xl font-black text-slate-800">وضعیت زیرساخت</h3>
          </div>
          
          <div class="space-y-8 flex-1">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <app-icon name="cpu-chip" class="w-5 h-5"></app-icon>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-700">هسته پردازش مرکزی</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Core Engine v4.2</span>
                  </div>
                </div>
                <span class="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">99.9%</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-[99%] rounded-full"></div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <app-icon name="list-bullet" class="w-5 h-5"></app-icon>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-700">پایگاه داده (PostgreSQL)</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Primary Cluster</span>
                  </div>
                </div>
                <span class="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">98.4%</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-[98%] rounded-full"></div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <app-icon name="sparkles" class="w-5 h-5"></app-icon>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-700">سرویس هوش مصنوعی</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">API Latency: 240ms</span>
                  </div>
                </div>
                <span class="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Stable</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-400 to-amber-600 w-[75%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100">
            <div class="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
              <app-icon name="shield-exclamation" class="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-125 transition-transform duration-700"></app-icon>
              <p class="text-xs font-black leading-relaxed relative z-10">
                تمامی سیستم‌ها در وضعیت عملیاتی هستند. آخرین بررسی امنیتی در ساعت ۲۰:۴۵ با موفقیت انجام شد.
              </p>
              <button class="mt-4 text-[10px] font-black bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all relative z-10">مشاهده جزئیات امنیتی</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AdminDashboardComponent {
  authService = inject(AuthService);
  configService = inject(ConfigService);
  historyService = inject(HistoryService);
}
