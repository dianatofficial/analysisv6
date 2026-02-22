import { Component, input, output } from '@angular/core';
import { IconComponent } from './ui/icon.component';
import { HistoryRecord, AnalysisInputs, ScenarioInputs } from '../models/types';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-history-card',
  imports: [LucideAngularModule],
  template: `
    <div 
      (click)="onClick()"
      class="minimal-card p-6 cursor-pointer group flex flex-col h-[280px] relative overflow-hidden"
    >
      <div class="flex justify-between items-start mb-4 relative z-10">
         <div class="flex items-center gap-2">
           <div class="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
              <lucide-icon [name]="item().type === 'analysis' ? 'bar-chart-2' : 'shield'" class="w-4 h-4"></lucide-icon>
           </div>
           <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ item().dateStr }}</span>
         </div>
      </div>
      
      <h3 class="font-bold text-lg text-black leading-tight line-clamp-3 mb-3 relative z-10">
        {{ getTitle() }}
      </h3>
      
      <p class="text-slate-500 text-xs font-medium line-clamp-2 mb-4 relative z-10">
         {{ getSubtitle() }}
      </p>

      <div class="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center relative z-10">
        <span class="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider">
          {{ item().type === 'analysis' ? 'تحلیل استراتژیک' : 'سناریو بحران' }}
        </span>
        
        <button class="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
          <lucide-icon name="arrow-left" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>
  `
})
export class HistoryCardComponent {
  item = input.required<HistoryRecord>();
  cardClick = output<HistoryRecord>();

  getTitle(): string {
    const record = this.item();
    if (record.type === 'analysis') {
      return (record.inputs as AnalysisInputs).subject;
    } else {
      return (record.inputs as ScenarioInputs).issue;
    }
  }

  getSubtitle(): string {
    const record = this.item();
    if (record.type === 'analysis') {
      return (record.inputs as AnalysisInputs).domain + ' | ' + (record.inputs as AnalysisInputs).scope;
    } else {
      return (record.inputs as ScenarioInputs).status + ' | ' + (record.inputs as ScenarioInputs).domain;
    }
  }

  onClick() {
    this.cardClick.emit(this.item());
  }
}
