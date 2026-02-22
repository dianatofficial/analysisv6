
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService } from '../services/history.service';
import { IconComponent } from './ui/icon.component';
import { HistoryRecord } from '../models/types';
import { HistoryCardComponent } from './history-card.component';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-history',
  imports: [LucideAngularModule, HistoryCardComponent],
  template: `
    <div class="w-full max-w-6xl mx-auto px-4 py-8">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-black tracking-tight mb-1">تاریخچه و سوابق</h1>
          <p class="text-slate-500 text-sm">آرشیو کامل تحلیل‌ها و سناریوهای تولید شده</p>
        </div>
        
        <div class="flex p-1 bg-slate-100 rounded-xl">
          <button 
            (click)="filter.set('all')" 
            [class]="filter() === 'all' ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-black'"
            class="px-5 py-2 rounded-lg text-xs font-bold transition-all"
          >همه</button>
          <button 
            (click)="filter.set('analysis')" 
            [class]="filter() === 'analysis' ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-black'"
            class="px-5 py-2 rounded-lg text-xs font-bold transition-all"
          >تحلیل</button>
          <button 
            (click)="filter.set('scenario')" 
            [class]="filter() === 'scenario' ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-black'"
            class="px-5 py-2 rounded-lg text-xs font-bold transition-all"
          >سناریو</button>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        @for (item of filteredList(); track item.id) {
          <app-history-card [item]="item" (cardClick)="openRecord($event)"></app-history-card>
        }
        
        @if (filteredList().length === 0) {
          <div class="col-span-full flex flex-col items-center justify-center py-24 text-slate-300">
            <lucide-icon name="file-text" class="w-16 h-16 mb-4 opacity-20"></lucide-icon>
            <p class="text-lg font-bold text-slate-400">هیچ موردی یافت نشد</p>
          </div>
        }
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class HistoryComponent implements OnInit {
  private historyService = inject(HistoryService);
  private router = inject(Router);

  filter = signal<'all' | 'analysis' | 'scenario'>('all');
  allRecords = signal<HistoryRecord[]>([]);

  filteredList = computed(() => {
    const f = this.filter();
    const list = this.allRecords();
    if (f === 'all') return list;
    return list.filter(x => x.type === f);
  });

  async ngOnInit() {
    const analysis = await this.historyService.getAnalysisHistory();
    const scenario = await this.historyService.getScenarioHistory();
    // Merge and sort by timestamp desc
    const merged = [...analysis, ...scenario].sort((a, b) => b.timestamp - a.timestamp);
    this.allRecords.set(merged);
  }

  openRecord(item: HistoryRecord) {
    if (item.type === 'analysis') {
      this.router.navigate(['/analysis/result', item.id]);
    } else {
      this.router.navigate(['/scenario/result', item.id]);
    }
  }
}
