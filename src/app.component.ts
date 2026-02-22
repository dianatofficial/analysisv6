
import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar.component';
import { FooterComponent } from './components/layout/footer.component';
import { NavigationTabsComponent } from './components/layout/navigation-tabs.component';
import { ConfigService } from './services/config.service';
import { AuthService } from './services/auth.service';
import { IconComponent } from './components/ui/icon.component';


import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NavigationTabsComponent, LucideAngularModule],
  
  template: `
    @if (isMaintenanceMode() && !authService.isSuperAdmin()) {
      <div class="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div class="max-w-md space-y-6 animate-fade-in">
          <div class="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
            <lucide-icon name="wrench" class="w-12 h-12 text-indigo-400"></lucide-icon>
          </div>
          <h1 class="text-4xl font-black text-white tracking-tight">در حال به‌روزرسانی</h1>
          <p class="text-slate-400 font-medium leading-relaxed">
            سامانه دیدبان در حال حاضر برای انجام تعمیرات دوره‌ای و ارتقای هسته هوش مصنوعی موقتاً در دسترس نیست. 
            لطفاً دقایقی دیگر مجدداً تلاش کنید.
          </p>
          <div class="pt-6 border-t border-white/5">
             <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Sentinel Strategic Node • Maintenance Mode</p>
          </div>
        </div>
      </div>
    } @else if (isLoginPage()) {
      <router-outlet></router-outlet>
    } @else {
      <div class="min-h-screen flex flex-col bg-background text-text selection:bg-black selection:text-white">

        <!-- Desktop Navbar -->
        <app-navbar class="hidden md:block"></app-navbar>

        <!-- Main Content -->
        <main class="flex-grow w-full pb-24 md:pb-0" [class.py-4]="!isAdminPanel()" [class.px-4]="!isAdminPanel()" [class.sm:px-6]="!isAdminPanel()" [class.lg:px-8]="!isAdminPanel()" [class.max-w-6xl]="!isAdminPanel()" [class.mx-auto]="!isAdminPanel()">
          
          <!-- Mode Toggle (Desktop only, or integrated into bottom nav for mobile) -->
          @if (!isProfilePage() && !isAdminPanel()) {
            <app-navigation-tabs class="hidden md:block"></app-navigation-tabs>
          }

          <!-- Dynamic Content -->
          <div class="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <router-outlet></router-outlet>
          </div>

        </main>
        
        <!-- Mobile/Tablet Bottom Nav -->
        <app-navigation-tabs class="md:hidden fixed bottom-0 left-0 right-0 z-50"></app-navigation-tabs>

        <app-footer class="hidden md:block"></app-footer>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class AppComponent {
  private router = inject(Router);
  private configService = inject(ConfigService);
  authService = inject(AuthService);

  isMaintenanceMode = computed(() => this.configService.config().maintenanceMode);

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isAdminPanel(): boolean {
    return this.router.url.startsWith('/admin');
  }

  isProfilePage(): boolean {
    return this.router.url === '/profile';
  }
}
