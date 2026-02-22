
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../ui/icon.component';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-navigation-tabs',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <!-- Desktop Tabs -->
    <div class="hidden md:flex mb-8 mt-2 justify-center">
      <div class="bg-slate-50 p-1 rounded-xl flex w-full max-w-lg border border-slate-200">
        
        <a routerLink="/analysis" routerLinkActive="bg-black text-white shadow-md" [routerLinkActiveOptions]="{exact: true}" class="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-black transition-all flex items-center justify-center gap-2">
          <lucide-icon name="bar-chart-2" class="w-4 h-4"></lucide-icon>
          <span>تحلیل راهبردی</span>
        </a>
        
        <a routerLink="/scenario" routerLinkActive="bg-black text-white shadow-md" [routerLinkActiveOptions]="{exact: true}" class="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-black transition-all flex items-center justify-center gap-2">
          <lucide-icon name="shield" class="w-4 h-4"></lucide-icon>
          <span>سناریونویسی</span>
        </a>

        <a routerLink="/history" routerLinkActive="bg-black text-white shadow-md" [routerLinkActiveOptions]="{exact: true}" class="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-black transition-all flex items-center justify-center gap-2">
          <lucide-icon name="history" class="w-4 h-4"></lucide-icon>
          <span>آرشیو</span>
        </a>

      </div>
    </div>

    <!-- Mobile 3D Bottom Nav -->
    <div class="md:hidden fixed bottom-6 left-4 right-4 z-[100] animate-nav-pop">
      <div class="bg-white/90 backdrop-blur-xl p-2 rounded-2xl flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 ring-1 ring-black/5">
        
        <a routerLink="/analysis" routerLinkActive="active-nav" [routerLinkActiveOptions]="{exact: true}" class="nav-item group">
          <div class="icon-container">
            <lucide-icon name="bar-chart-2" class="w-6 h-6"></lucide-icon>
          </div>
          <span class="text-[10px] font-bold mt-1 opacity-0 group-[.active-nav]:opacity-100 transition-opacity">تحلیل</span>
        </a>
        
        <a routerLink="/scenario" routerLinkActive="active-nav" [routerLinkActiveOptions]="{exact: true}" class="nav-item group">
          <div class="icon-container">
            <lucide-icon name="shield" class="w-6 h-6"></lucide-icon>
          </div>
          <span class="text-[10px] font-bold mt-1 opacity-0 group-[.active-nav]:opacity-100 transition-opacity">سناریو</span>
        </a>

        <a routerLink="/history" routerLinkActive="active-nav" [routerLinkActiveOptions]="{exact: true}" class="nav-item group">
          <div class="icon-container">
            <lucide-icon name="history" class="w-6 h-6"></lucide-icon>
          </div>
          <span class="text-[10px] font-bold mt-1 opacity-0 group-[.active-nav]:opacity-100 transition-opacity">آرشیو</span>
        </a>

        <a routerLink="/profile" routerLinkActive="active-nav" class="nav-item group">
          <div class="icon-container">
            <lucide-icon name="user" class="w-6 h-6"></lucide-icon>
          </div>
          <span class="text-[10px] font-bold mt-1 opacity-0 group-[.active-nav]:opacity-100 transition-opacity">پروفایل</span>
        </a>

      </div>
    </div>
  `,
  styles: [`
    .nav-item {
      @apply flex flex-col items-center justify-center w-16 h-12 transition-all duration-300;
    }
    .icon-container {
      @apply p-2 rounded-xl transition-all duration-300 text-slate-400;
    }
    .active-nav .icon-container {
      @apply bg-black text-white shadow-lg -translate-y-4 scale-110 ring-4 ring-white;
    }
    .active-nav {
      @apply text-black;
    }
  `]
})
export class NavigationTabsComponent {}
