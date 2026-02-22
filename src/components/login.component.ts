
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from './ui/icon.component';
import { AuthService } from '../services/auth.service';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">
      
      <!-- Login Card -->
      <div class="relative z-10 w-full max-w-md px-6 animate-fade-in">
        
        <div class="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm">
          
          <!-- Logo & Header -->
          <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl shadow-lg mb-6">
              <lucide-icon name="shield-alert" class="w-8 h-8 text-white"></lucide-icon>
            </div>
            <h2 class="text-2xl font-bold text-black tracking-tight mb-1">ورود به سامانه دیدبان</h2>
            <p class="text-slate-500 font-medium text-xs uppercase tracking-widest">Strategic Intelligence Platform</p>
          </div>

          <!-- Form -->
          <div class="space-y-5">
            
            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pr-1">Username</label>
              <div class="relative group">
                <lucide-icon name="user" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors"></lucide-icon>
                <input 
                  type="text" 
                  [ngModel]="username()" 
                  (ngModelChange)="username.set($event)"
                  class="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-black outline-none transition-all font-bold text-black ltr text-left text-sm"
                  placeholder="نام کاربری"
                  [disabled]="loading()"
                >
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pr-1">Password</label>
              <div class="relative group">
                <lucide-icon name="lock" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors"></lucide-icon>
                <input 
                  type="password" 
                  [ngModel]="password()" 
                  (ngModelChange)="password.set($event)"
                  class="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-black outline-none transition-all font-bold text-black ltr text-left text-sm"
                  placeholder="••••••••"
                  [disabled]="loading()"
                  (keyup.enter)="onLogin()"
                >
              </div>
            </div>

            @if (error()) {
              <div class="bg-red-50 border border-red-100 p-3 rounded-lg flex items-center gap-2 animate-shake">
                <lucide-icon name="alert-circle" class="w-4 h-4 text-red-500"></lucide-icon>
                <p class="text-[11px] font-bold text-red-600">{{ error() }}</p>
              </div>
            }

            <button 
              (click)="onLogin()"
              [disabled]="loading()"
              class="w-full py-3.5 bg-black hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              @if (loading()) {
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              } @else {
                <span>ورود به سیستم</span>
                <lucide-icon name="log-in" class="w-4 h-4 group-hover:translate-x-[-2px] transition-transform"></lucide-icon>
              }
            </button>

          </div>

          <!-- Footer -->
          <div class="mt-8 pt-6 border-t border-slate-100 text-center">
            <p class="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>

        </div>

        <!-- System Info -->
        <div class="mt-6 flex items-center justify-between px-2">
           <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
           </div>
           <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">v6.0.0</span>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .ltr { direction: ltr; }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `]
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  username = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  async onLogin() {
    if (!this.username() || !this.password()) {
      this.error.set('لطفا تمام فیلدها را تکمیل کنید');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    try {
      const success = await this.authService.login(this.username(), this.password());
      
      if (success) {
        this.router.navigate(['/analysis']);
      } else {
        this.error.set('نام کاربری یا رمز عبور اشتباه است');
      }
    } catch {
      this.error.set('خطا در برقراری ارتباط با سرور');
    } finally {
      this.loading.set(false);
    }
  }
}
