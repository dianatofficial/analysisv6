
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../ui/icon.component';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-[60] h-16 flex items-center">
      <div class="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
        
        <!-- Brand -->
        <div class="flex items-center gap-3">
          <div class="bg-black p-2 rounded-lg">
             <lucide-icon name="shield-alert" class="w-5 h-5 text-white"></lucide-icon>
          </div>
          <div class="flex flex-col">
            <h1 class="text-lg font-bold tracking-tight text-black leading-none">{{ config().appName }}</h1>
            <span class="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{{ config().logoText }}</span>
          </div>
        </div>

         <!-- Actions -->
         <div class="flex items-center gap-1">
           
            <a routerLink="/analysis" routerLinkActive="bg-black text-white" [routerLinkActiveOptions]="{exact: true}" class="flex items-center justify-center px-4 h-10 rounded-lg transition-all text-slate-500 hover:text-black font-medium text-sm gap-2" title="خانه">
               <lucide-icon name="home" class="w-4 h-4"></lucide-icon>
               <span>خانه</span>
            </a>

            <a routerLink="/profile" routerLinkActive="bg-black text-white" class="flex items-center justify-center px-4 h-10 rounded-lg transition-all text-slate-500 hover:text-black font-medium text-sm gap-2" title="داشبورد">
               <lucide-icon name="user" class="w-4 h-4"></lucide-icon>
               <span>داشبورد</span>
            </a>

           @if (authService.isAdmin()) {
             <a routerLink="/admin" routerLinkActive="bg-black text-white" class="flex items-center justify-center px-4 h-10 rounded-lg transition-all text-slate-500 hover:text-black font-medium text-sm gap-2" title="مدیریت">
               <lucide-icon name="settings" class="w-4 h-4"></lucide-icon>
               <span>مدیریت</span>
             </a>
           }

           <div class="w-px h-6 bg-slate-200 mx-2"></div>

           <button (click)="logout()" class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all" title="خروج">
             <lucide-icon name="log-out" class="w-5 h-5"></lucide-icon>
           </button>
         </div>

      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  configService = inject(ConfigService);
  config = this.configService.config;

  logout() {
    this.authService.logout();
  }
}
