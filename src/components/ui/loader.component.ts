
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm transition-all animate-fade-in">
      
      <!-- Minimal Loader Card -->
      <div class="bg-slate-900 text-white rounded-2xl shadow-2xl px-8 py-5 flex items-center gap-5 border border-slate-700 min-w-[280px] max-w-sm mx-4 transform transition-all">
        
        <!-- Spinner -->
        <div class="relative flex items-center justify-center w-8 h-8 shrink-0">
           <div class="absolute w-full h-full border-2 border-indigo-500/30 rounded-full"></div>
           <div class="absolute w-full h-full border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
           <div class="absolute w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
        </div>

        <!-- Text Content -->
        <div class="flex flex-col">
           <h3 class="font-black text-lg tracking-tight leading-tight">تحلیل استراتژیک</h3>
           <div class="flex items-center gap-1.5 mt-1">
             <span class="text-[10px] text-slate-400 font-bold">در حال پردازش</span>
             <div class="flex gap-0.5">
                <span class="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0s"></span>
                <span class="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
                <span class="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
             </div>
           </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class LoaderComponent {}
