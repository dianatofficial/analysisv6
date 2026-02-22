
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HistoryService } from '../services/history.service';
import { ExportService } from '../services/export.service';
import { HistoryRecord, AnalysisInputs, ScenarioInputs } from '../models/types';
import { IconComponent } from './ui/icon.component';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      
      <!-- Profile Card -->
      <div class="minimal-card p-8 relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
           <div class="w-20 h-20 bg-black rounded-2xl flex items-center justify-center shadow-xl text-white">
             <span class="text-2xl font-bold">{{ getInitials() }}</span>
           </div>
           
           <div class="flex-1 text-center md:text-right space-y-2">
              <div>
                 <h1 class="text-2xl font-bold text-black tracking-tight">{{ user()?.fullName }}</h1>
                 <p class="text-slate-500 font-medium text-xs mt-1">{{ user()?.role === 'admin' ? 'مدیر ارشد سیستم' : 'تحلیلگر استراتژیک' }}</p>
              </div>
              
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 text-slate-500 font-bold">
                <span class="bg-slate-50 px-2.5 py-1 rounded border border-slate-100 text-[10px] flex items-center gap-1.5 uppercase tracking-wider">
                  <lucide-icon name="user" class="w-3 h-3"></lucide-icon>
                  {{ user()?.username }}
                </span>
                <span class="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-100 text-[10px] flex items-center gap-1.5 uppercase tracking-wider">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  فعال
                </span>
              </div>
           </div>

           <div class="flex gap-3 w-full md:w-auto">
              <div class="flex-1 bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                <span class="block text-xl font-bold text-black">{{ analysisCount() }}</span>
                <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">تحلیل‌ها</span>
              </div>
              <div class="flex-1 bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                <span class="block text-xl font-bold text-black">{{ scenarioCount() }}</span>
                <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">سناریوها</span>
              </div>
           </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-8 border-b border-slate-200">
        <button 
          (click)="activeTab.set('analysis')"
          [class]="activeTab() === 'analysis' ? 'text-black border-black' : 'text-slate-400 border-transparent hover:text-black'"
          class="pb-3 px-1 font-bold text-sm border-b-2 -mb-[1px] transition-all flex items-center gap-2 uppercase tracking-wider"
        >
          <lucide-icon name="bar-chart-2" class="w-4 h-4"></lucide-icon>
          <span>سوابق تحلیل</span>
        </button>
        <button 
           (click)="activeTab.set('scenario')"
           [class]="activeTab() === 'scenario' ? 'text-black border-black' : 'text-slate-400 border-transparent hover:text-black'"
           class="pb-3 px-1 font-bold text-sm border-b-2 -mb-[1px] transition-all flex items-center gap-2 uppercase tracking-wider"
        >
          <lucide-icon name="shield" class="w-4 h-4"></lucide-icon>
          <span>سوابق سناریو</span>
        </button>
      </div>

      <!-- History List -->
      <div class="space-y-4 min-h-[300px]">
         @if (loading()) {
            <div class="flex items-center justify-center h-40">
               <div class="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
            </div>
         } @else if (currentList().length === 0) {
            <div class="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 border-dashed animate-fade-in">
              <p class="text-slate-500 font-bold text-sm">هیچ رکوردی در این بخش یافت نشد.</p>
            </div>
         } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              @for (item of currentList(); track item.id) {
                <div class="minimal-card p-6 flex flex-col h-full group relative overflow-hidden cursor-pointer" (click)="previewRecord(item)">
                  <div class="flex justify-between items-start mb-4">
                    <div class="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
                      <lucide-icon [name]="item.type === 'analysis' ? 'file-text' : 'shield-alert'" class="w-4 h-4"></lucide-icon>
                    </div>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ item.dateStr.split('،')[0] }}</span>
                  </div>

                  <h3 class="font-bold text-base text-black mb-2 line-clamp-2 leading-tight">
                    {{ item.type === 'analysis' ? asAnalysis(item.inputs).subject : asScenario(item.inputs).issue }}
                  </h3>

                  <div class="flex flex-wrap gap-2 mb-4">
                     <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider">
                      {{ item.type === 'analysis' ? asAnalysis(item.inputs).domain : asScenario(item.inputs).domain }}
                    </span>
                  </div>
                  
                  <div class="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 group-hover:text-black transition-colors uppercase tracking-widest">
                     <span>مشاهده جزئیات</span>
                     <lucide-icon name="arrow-left" class="w-3.5 h-3.5"></lucide-icon>
                  </div>
                </div>
              }
            </div>
         }
      </div>

      <!-- Preview Modal -->
      @if (selectedRecord(); as record) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="selectedRecord.set(null)"></div>
          
          <!-- Modal Card -->
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in relative z-10 border border-slate-200">
            
            <!-- Modal Header -->
            <div class="p-6 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-20">
              <div class="pr-2">
                <div class="flex items-center gap-2 mb-2">
                   <span class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black text-white">
                      {{ record.type === 'analysis' ? 'REPORT' : 'SCENARIO' }}
                   </span>
                   <span class="text-slate-400 text-[10px] font-mono">{{ record.dateStr }}</span>
                </div>
                <h3 class="font-bold text-xl text-black leading-tight">
                  {{ record.type === 'analysis' ? asAnalysis(record.inputs).subject : asScenario(record.inputs).issue }}
                </h3>
              </div>
              <button (click)="selectedRecord.set(null)" class="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-black">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-8 overflow-y-auto markdown-content text-justify leading-relaxed bg-white custom-scrollbar">
               <div class="prose max-w-none text-slate-800 text-sm">
                  {{ record.result }}
               </div>
            </div>

            <!-- Modal Footer (Actions) -->
            <div class="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center z-20">
              <div class="text-[10px] text-slate-400 font-bold hidden sm:block uppercase tracking-widest">
                ID: <span class="font-mono select-all">{{ record.id.split('-')[0] }}</span>
              </div>
              <div class="flex gap-3 w-full sm:w-auto">
                 <button (click)="exportWord(record)" class="flex-1 sm:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
                    <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
                    <span>Word</span>
                 </button>
                 <button (click)="exportPdf()" class="flex-1 sm:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm">
                    <lucide-icon name="printer" class="w-4 h-4"></lucide-icon>
                    <span>PDF</span>
                 </button>
              </div>
            </div>

          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }
    .animate-scale-in {
      animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { 
      from { opacity: 0; transform: scale(0.95); } 
      to { opacity: 1; transform: scale(1); } 
    }
    
    /* Custom Scrollbar for Modal */
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class UserPanelComponent implements OnInit {
  authService = inject(AuthService);
  historyService = inject(HistoryService);
  exportService = inject(ExportService);
  
  user = this.authService.currentUser;
  
  activeTab = signal<'analysis' | 'scenario'>('analysis');
  
  analysisHistory = signal<HistoryRecord[]>([]);
  scenarioHistory = signal<HistoryRecord[]>([]);
  loading = signal(false);
  
  // Computed property for the current list
  currentList = computed(() => {
    return this.activeTab() === 'analysis' ? this.analysisHistory() : this.scenarioHistory();
  });
  
  selectedRecord = signal<HistoryRecord | null>(null);

  async ngOnInit() {
    this.loading.set(true);
    try {
      // Simulate API latency
      const [analysis, scenarios] = await Promise.all([
        this.historyService.getAnalysisHistory(),
        this.historyService.getScenarioHistory()
      ]);
      
      this.analysisHistory.set(analysis);
      this.scenarioHistory.set(scenarios);
    } finally {
      this.loading.set(false);
    }
  }

  getInitials(): string {
    const name = this.user()?.fullName || '';
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  }

  formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('fa-IR');
  }

  analysisCount() { return this.analysisHistory().length; }
  scenarioCount() { return this.scenarioHistory().length; }

  asAnalysis(input: AnalysisInputs | ScenarioInputs): AnalysisInputs { return input as AnalysisInputs; }
  asScenario(input: AnalysisInputs | ScenarioInputs): ScenarioInputs { return input as ScenarioInputs; }

  previewRecord(item: HistoryRecord) {
    this.selectedRecord.set(item);
  }

  exportWord(record: HistoryRecord) {
    if (record.type === 'analysis') {
      const inputs = record.inputs as AnalysisInputs;
      this.exportService.exportToWord(inputs.subject, record.result, {
        'حوزه': inputs.domain,
        'تاریخ ثبت': record.dateStr
      });
    } else {
      const inputs = record.inputs as ScenarioInputs;
      this.exportService.exportToWord(inputs.issue, record.result, {
        'حوزه': inputs.domain,
        'وضعیت': inputs.status,
         'تاریخ ثبت': record.dateStr
      });
    }
  }

  exportPdf() {
     window.print();
  }
}
