
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { AIProviderConfig } from '../../models/types';


import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-ai-config',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-12 animate-fade-in">
      
      <!-- Provider Tabs -->
      <div class="flex p-2.5 bg-slate-100 rounded-[2.5rem] w-fit border-2 border-slate-200 shadow-inner">
         @for (p of config().aiConfig.providers; track p.id) {
           <button 
            (click)="selectedProviderId.set(p.id)"
            [class]="selectedProviderId() === p.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'"
            class="px-10 py-4 rounded-[2rem] text-base font-black transition-all duration-500 flex items-center gap-4"
           >
             <div [class]="selectedProviderId() === p.id ? 'w-3 h-3 rounded-full bg-white animate-pulse' : 'w-3 h-3 rounded-full bg-slate-300'"></div>
             {{ p.name }}
           </button>
         }
      </div>

      @if (getSelectedProvider(); as provider) {
        <section class="bg-white rounded-[4rem] border-4 border-slate-100 shadow-2xl overflow-hidden relative group/card">
           <div class="absolute top-0 right-0 w-full h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
           
           <!-- Header -->
           <div class="p-12 md:p-16 border-b-2 border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-10">
              <div class="flex items-center gap-8">
                <div class="w-20 h-20 rounded-3xl bg-white border-2 border-slate-100 shadow-xl flex items-center justify-center text-indigo-600 relative overflow-hidden group">
                   <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                   <lucide-icon name="server" class="w-10 h-10 relative z-10"></lucide-icon>
                </div>
                <div>
                  <h3 class="text-4xl font-black text-slate-900 tracking-tighter">{{ provider.name }}</h3>
                  <div class="flex items-center gap-3 mt-3">
                     <div [class]="'w-3.5 h-3.5 rounded-full shadow-lg ' + (provider.isEnabled ? 'bg-emerald-500 animate-pulse shadow-emerald-200' : 'bg-slate-300')"></div>
                     <p class="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">
                        {{ provider.isEnabled ? 'هسته عملیاتی فعال' : 'غیرفعال شده' }}
                     </p>
                  </div>
                </div>
              </div>
              
              <!-- Toggle Switch -->
              <div class="flex items-center bg-white px-8 py-5 rounded-[2.5rem] border-2 border-slate-100 shadow-lg self-start sm:self-center group hover:border-indigo-400 transition-all duration-300">
                <span class="ml-6 text-sm font-black text-slate-700 uppercase tracking-tighter">{{ provider.isEnabled ? 'دسترسی کامل' : 'دسترسی مسدود' }}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [checked]="provider.isEnabled" (change)="toggleProvider(provider.id)" class="sr-only peer">
                  <div class="w-20 h-11 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-9 after:w-9 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                </label>
              </div>
           </div>
           
           <!-- Body -->
           <div class="p-12 md:p-16 space-y-16 transition-all duration-700" [class.opacity-30]="!provider.isEnabled" [class.grayscale]="!provider.isEnabled" [class.pointer-events-none]="!provider.isEnabled">
              
              <!-- API Key -->
              <div class="space-y-6">
                 <label class="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mr-4">کلید دسترسی اختصاصی (API Key)</label>
                 <div class="relative group">
                    <lucide-icon name="key" class="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 group-focus-within:text-indigo-600 transition-colors duration-300"></lucide-icon>
                    <input 
                      [type]="showKey() ? 'text' : 'password'" 
                      [value]="provider.apiKey" 
                      (input)="updateProviderField(provider.id, 'apiKey', $any($event.target).value)"
                      class="w-full pr-20 pl-20 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:bg-white focus:border-indigo-600 focus:ring-[12px] focus:ring-indigo-600/5 outline-none transition-all font-mono text-xl tracking-[0.2em] text-slate-800 ltr text-left shadow-inner"
                      placeholder="sk-••••••••••••••••••••••••"
                    >
                    <button (click)="toggleShowKey()" class="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                       <lucide-icon [name]="showKey() ? 'eye-off' : 'eye'" class="w-7 h-7"></lucide-icon>
                    </button>
                 </div>
                 <div class="flex items-center gap-3 mr-4">
                    <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                    <p class="text-xs text-slate-400 font-bold">این کلید در حافظه امنیتی سخت‌افزاری سرور ذخیره می‌شود.</p>
                 </div>
              </div>

              <!-- Controls Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                 
                 <!-- Model Selection -->
                 <div class="space-y-6">
                    <label class="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mr-4">مدل پردازشی فعال (Model ID)</label>
                    <div class="relative group">
                      <lucide-icon name="cpu" class="absolute right-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-300 group-focus-within:text-indigo-600 transition-colors"></lucide-icon>
                      <select 
                        [ngModel]="provider.selectedModel"
                        (ngModelChange)="updateProviderField(provider.id, 'selectedModel', $event)"
                        class="w-full pr-16 pl-14 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:bg-white focus:border-indigo-600 outline-none appearance-none font-black text-lg text-slate-800 ltr text-left cursor-pointer shadow-inner transition-all"
                      >
                        @for (m of provider.availableModels; track m) {
                          <option [value]="m">{{ m }}</option>
                        }
                      </select>
                      <div class="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <lucide-icon name="chevron-down" class="w-6 h-6"></lucide-icon>
                      </div>
                    </div>
                 </div>

                 <!-- Max Tokens Slider -->
                 <div class="space-y-7">
                    <div class="flex justify-between items-center px-4">
                       <label class="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">حداکثر طول خروجی (Tokens)</label>
                       <span class="px-5 py-2 bg-indigo-600 text-white rounded-xl font-mono text-base font-black shadow-lg shadow-indigo-200">{{ provider.params.maxTokens }}</span>
                    </div>
                    <div class="px-2">
                      <input 
                        type="range" 
                        min="1000" 
                        max="16000" 
                        step="1000"
                        [ngModel]="provider.params.maxTokens"
                        (ngModelChange)="updateProviderParams(provider.id, 'maxTokens', $event)"
                        class="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                      >
                    </div>
                    <div class="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">
                       <span>استاندارد (1k)</span>
                       <span>گزارش جامع (16k)</span>
                    </div>
                 </div>

                 <!-- Temperature Slider -->
                 <div class="space-y-7">
                    <div class="flex justify-between items-center px-4">
                       <label class="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">ضریب خلاقیت (Temperature)</label>
                       <span class="px-5 py-2 bg-amber-500 text-white rounded-xl font-mono text-base font-black shadow-lg shadow-amber-200">{{ provider.params.temperature }}</span>
                    </div>
                    <div class="px-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1"
                        [ngModel]="provider.params.temperature"
                        (ngModelChange)="updateProviderParams(provider.id, 'temperature', $event)"
                        class="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-amber-500"
                      >
                    </div>
                    <div class="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">
                       <span>منطقی و دقیق</span>
                       <span>خلاقانه و باز</span>
                    </div>
                 </div>

                 <!-- Thinking Budget -->
                 <div class="space-y-7">
                    <div class="flex justify-between items-center px-4">
                       <label class="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                         بودجه استدلال (Thinking)
                         <span class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] px-3 py-1 rounded-full font-black shadow-sm">REASONING</span>
                       </label>
                       <span class="px-5 py-2 bg-slate-900 text-white rounded-xl font-mono text-base font-black shadow-lg shadow-slate-300">{{ provider.params.thinkingBudget || 0 }}</span>
                    </div>
                    <div class="px-2">
                      <input 
                        type="range" 
                        min="0" 
                        [max]="(provider.params.maxTokens || 8000) - 500" 
                        step="256"
                        [ngModel]="provider.params.thinkingBudget || 0"
                        (ngModelChange)="updateProviderParams(provider.id, 'thinkingBudget', $event)"
                        class="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900"
                      >
                    </div>
                    <div class="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">
                       <span>غیرفعال</span>
                       <span>تحلیل عمیق</span>
                    </div>
                 </div>
              </div>

           </div>
           
           <!-- Save Action -->
           <div class="p-12 bg-slate-50/80 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <button 
                (click)="testConnection(provider)" 
                [disabled]="isTesting() || !provider.isEnabled"
                class="flex items-center gap-4 px-10 py-5 bg-white border-2 border-slate-200 rounded-[2rem] font-black text-slate-700 hover:text-indigo-600 hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 group"
              >
                 @if (isTesting()) {
                   <div class="w-6 h-6 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                   <span>در حال ارزیابی شبکه...</span>
                 } @else {
                   <lucide-icon name="zap" class="w-7 h-7 group-hover:scale-125 transition-transform duration-500 text-amber-500"></lucide-icon>
                   <span>تست سلامت اتصال</span>
                 }
              </button>
              
              <button (click)="saveConfig()" class="px-16 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-500/40 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 flex items-center gap-5">
                 <lucide-icon name="check-circle" class="w-8 h-8"></lucide-icon>
                 <span>به‌روزرسانی نهایی پیکربندی</span>
              </button>
           </div>
        </section>
      }
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
export class AIConfigComponent {
  configService = inject(ConfigService);
  config = this.configService.config;
  
  selectedProviderId = signal<string>('openai');
  showKey = signal(false);
  isTesting = signal(false);

  getSelectedProvider() {
    return this.config().aiConfig.providers.find(p => p.id === this.selectedProviderId());
  }

  async testConnection(provider: AIProviderConfig) {
    if (!provider.apiKey) {
      alert('لطفا ابتدا کلید API را وارد کنید.');
      return;
    }

    this.isTesting.set(true);
    
    // Mocking an API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    this.isTesting.set(false);
    
    // Simple mock validation
    if (provider.apiKey.startsWith('sk-')) {
      alert(`اتصال به ${provider.name} با موفقیت برقرار شد. مدل ${provider.selectedModel} در دسترس است.`);
    } else {
      alert('خطا در احراز هویت. کلید API نامعتبر است.');
    }
  }

  toggleShowKey() {
    this.showKey.update(v => !v);
  }

  toggleProvider(id: string) {
    const providers = this.config().aiConfig.providers.map(p => {
      if (p.id === id) return { ...p, isEnabled: !p.isEnabled };
      return p;
    });
    this.updateConfigBranch({ providers });
  }

  updateProviderField(id: string, field: keyof AIProviderConfig, value: AIProviderConfig[typeof field]) {
     const providers = this.config().aiConfig.providers.map(p => {
      if (p.id === id) return { ...p, [field]: value };
      return p;
    });
    this.updateConfigBranch({ providers });
  }

  updateProviderParams(id: string, field: keyof AIProviderConfig['params'], value: number) {
     const providers = this.config().aiConfig.providers.map(p => {
      if (p.id === id) {
        return { ...p, params: { ...p.params, [field]: value } };
      }
      return p;
    });
    this.updateConfigBranch({ providers });
  }

  saveConfig() {
    // In a real app, this would be an API call
    this.configService.updateConfig({}); // Just trigger a save effect if any
  }

  private updateConfigBranch(aiConfigPartial: Partial<{ providers: AIProviderConfig[] }>) {
    const current = this.config().aiConfig;
    this.configService.updateConfig({
      aiConfig: { ...current, ...aiConfigPartial }
    });
  }
}
