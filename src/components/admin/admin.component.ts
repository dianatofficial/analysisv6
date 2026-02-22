
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../ui/icon.component';
import { AuthService } from '../../services/auth.service';
import { UserManagementComponent } from './user-management.component';
import { AIConfigComponent } from './ai-config.component';
import { FormOptionsComponent } from './form-options.component';
import { GeneralSettingsComponent } from './general-settings.component';
import { AdminDashboardComponent } from './dashboard.component';
import { AnalysisSettingsComponent } from './analysis-settings.component';
import { ScenarioSettingsComponent } from './scenario-settings.component';

type AdminTab = 'dashboard' | 'users' | 'ai-config' | 'forms' | 'settings' | 'analysis-settings' | 'scenario-settings';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    LucideAngularModule, 
    UserManagementComponent, 
    AIConfigComponent, 
    FormOptionsComponent, 
    GeneralSettingsComponent,
    AdminDashboardComponent,
    AnalysisSettingsComponent,
    ScenarioSettingsComponent
  ],
  template: `
    <div class="flex font-sans text-slate-800 h-[calc(100vh-80px)] bg-slate-50">
      
      <!-- Modern Light Sidebar (Desktop) -->
      <aside class="fixed bottom-0 right-0 top-16 sm:top-20 w-72 bg-white border-l border-slate-200 transition-all duration-300 z-50 flex flex-col shadow-sm overflow-hidden hidden md:flex">
        
        <!-- Navigation -->
        <nav class="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
          
          <div class="px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">عملیات</div>
          
          <button (click)="activeTab.set('dashboard')" [class]="getNavLinkClass('dashboard')">
            <lucide-icon name="home" class="w-5 h-5"></lucide-icon>
            <span>داشبورد عملیاتی</span>
            @if (activeTab() === 'dashboard') { <div class="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full"></div> }
          </button>

          <div class="mt-8 px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">کاربران و دسترسی</div>
          
          <button (click)="activeTab.set('users')" [class]="getNavLinkClass('users')">
            <lucide-icon name="users" class="w-5 h-5"></lucide-icon>
            <span>مدیریت کاربران</span>
            @if (activeTab() === 'users') { <div class="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full"></div> }
          </button>

          <div class="mt-8 px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">ماژول‌های هوشمند</div>
          
          <button (click)="activeTab.set('analysis-settings')" [class]="getNavLinkClass('analysis-settings')">
            <lucide-icon name="bar-chart-2" class="w-5 h-5"></lucide-icon>
            <span>تنظیمات تحلیل استراتژیک</span>
            @if (activeTab() === 'analysis-settings') { <div class="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full"></div> }
          </button>

          <button (click)="activeTab.set('scenario-settings')" [class]="getNavLinkClass('scenario-settings')">
            <lucide-icon name="sparkles" class="w-5 h-5"></lucide-icon>
            <span>تنظیمات سناریونگاری</span>
            @if (activeTab() === 'scenario-settings') { <div class="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full"></div> }
          </button>

          @if (authService.isSuperAdmin()) {
            <div class="mt-8 px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">هوش مصنوعی</div>

            <button (click)="activeTab.set('ai-config')" [class]="getNavLinkClass('ai-config')">
               <lucide-icon name="cpu" class="w-5 h-5"></lucide-icon>
               <span>پیکربندی مدل‌ها</span>
               @if (activeTab() === 'ai-config') { <div class="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full"></div> }
            </button>

            <div class="mt-8 px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">سیستم</div>

            <button (click)="activeTab.set('forms')" [class]="getNavLinkClass('forms')">
              <lucide-icon name="list" class="w-5 h-5"></lucide-icon>
              <span>داده‌های پایه فرم‌ها</span>
              @if (activeTab() === 'forms') { <div class="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full"></div> }
            </button>

            <button (click)="activeTab.set('settings')" [class]="getNavLinkClass('settings')">
              <lucide-icon name="sliders-horizontal" class="w-5 h-5"></lucide-icon>
              <span>تنظیمات عمومی</span>
               @if (activeTab() === 'settings') { <div class="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full"></div> }
            </button>
          }
        </nav>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
           <button (click)="returnToApp()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-slate-500 hover:text-indigo-600 transition-all group shadow-sm border border-transparent hover:border-slate-200">
            <lucide-icon name="log-out" class="w-5 h-5 rotate-180 group-hover:scale-110 transition-transform"></lucide-icon>
            <span class="font-bold text-xs">بازگشت به سامانه</span>
          </button>

           <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all group">
            <lucide-icon name="log-out" class="w-5 h-5"></lucide-icon>
            <span class="font-bold text-xs">خروج امن</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 md:pr-72 w-full h-full overflow-y-auto scroll-smooth p-6 md:p-10">
        <div class="max-w-7xl mx-auto">
          
          <!-- Top Bar / Header Redesign -->
          <header class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-2 text-indigo-600 mb-2">
                 <lucide-icon name="settings" class="w-5 h-5"></lucide-icon>
                 <span class="text-[10px] font-black uppercase tracking-widest">پنل مدیریت سیستم</span>
              </div>
              <h2 class="text-3xl font-black text-slate-900 tracking-tight">{{ getPageTitle() }}</h2>
              <p class="text-slate-500 mt-1 font-bold text-sm">مدیریت متمرکز و پایش هوشمند سامانه دیدبان</p>
            </div>
            
            <div class="flex items-center gap-4 relative z-10">
               <div class="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                 <div class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </div>
                 <div class="flex flex-col">
                   <span class="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">وضعیت سرور</span>
                   <span class="text-xs font-black text-slate-700">عملیاتی (Online)</span>
                 </div>
               </div>
            </div>
          </header>

          <!-- Dynamic Tab Content -->
          <div class="animate-fade-in">
            @switch (activeTab()) {
              @case ('dashboard') { <app-admin-dashboard></app-admin-dashboard> }
              @case ('users') { <app-admin-users></app-admin-users> }
              @case ('ai-config') { <app-admin-ai-config></app-admin-ai-config> }
              @case ('forms') { <app-admin-form-options></app-admin-form-options> }
              @case ('settings') { <app-admin-general-settings></app-admin-general-settings> }
              @case ('analysis-settings') { <app-admin-analysis-settings></app-admin-analysis-settings> }
              @case ('scenario-settings') { <app-admin-scenario-settings></app-admin-scenario-settings> }
            }
          </div>

        </div>
      </main>
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
export class AdminComponent {
  authService = inject(AuthService);
  router = inject(Router);

  // Signals
  activeTab = signal<AdminTab>('dashboard');

  constructor() {
    // If not super admin, force to users tab (though sidebar handles it too)
    if (!this.authService.isSuperAdmin()) {
      this.activeTab.set('users');
    }
  }

  getPageTitle() {
    switch(this.activeTab()) {
      case 'dashboard': return 'داشبورد عملیاتی';
      case 'users': return 'مدیریت کاربران';
      case 'ai-config': return 'پیکربندی هوش مصنوعی';
      case 'forms': return 'مدیریت داده‌های پایه';
      case 'settings': return 'تنظیمات عمومی';
      case 'analysis-settings': return 'تنظیمات تحلیل استراتژیک';
      case 'scenario-settings': return 'تنظیمات سناریونگاری';
    }
  }

  getNavLinkClass(tab: AdminTab) {
    const base = "relative px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 group w-full text-right font-bold text-sm ";
    return this.activeTab() === tab 
      ? base + "text-indigo-600 bg-indigo-50 shadow-sm" 
      : base + "text-slate-500 hover:text-indigo-600 hover:bg-slate-50";
  }

  returnToApp() {
    this.router.navigate(['/analysis']);
  }

  logout() {
    this.authService.logout();
  }
}
