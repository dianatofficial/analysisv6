
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryService } from '../services/history.service';
import { ExportService } from '../services/export.service';
import { ConfigService } from '../services/config.service';

import { AnalysisInputs, HistoryRecord } from '../models/types';
import { LoaderComponent } from './ui/loader.component';
import { marked } from 'marked';

@Component({
  selector: 'app-analysis-result',
  imports: [LoaderComponent],
  template: `
    <div class="w-full max-w-6xl mx-auto px-4 py-6 min-h-screen">
      
      @if (loading()) {
        <app-loader></app-loader>
      } @else if (!record()) {
        <div class="flex flex-col items-center justify-center h-96 text-slate-400">
          <lucide-icon name="file" class="w-12 h-12 mb-4 opacity-20"></lucide-icon>
          <p class="text-lg font-bold">رکوردی یافت نشد</p>
          <button (click)="goBack()" class="mt-6 px-6 py-2 bg-black text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">بازگشت</button>
        </div>
      } @else {
        <div class="animate-fade-in pb-20">
          
          <!-- Result Navbar -->
          <div class="sticky top-4 z-40 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center justify-between no-print max-w-4xl mx-auto">
             <button (click)="goBack()" class="flex items-center gap-2 text-slate-500 hover:text-black transition-colors font-bold px-4 py-2 rounded-lg hover:bg-slate-50">
                <lucide-icon name="log-out" class="w-4 h-4 rotate-180"></lucide-icon>
                <span class="hidden sm:inline">بازگشت</span>
             </button>
             
             <div class="flex gap-2">
                <button (click)="exportToWord()" class="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-bold hover:bg-slate-100 transition-colors" title="Word">
                  <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
                  <span class="hidden sm:inline text-xs">Word</span>
                </button>
                <button (click)="exportToPdf()" class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-sm" title="PDF">
                  <lucide-icon name="printer" class="w-4 h-4"></lucide-icon>
                  <span class="hidden sm:inline text-xs">PDF</span>
                </button>
             </div>
          </div>

          <!-- Report Paper -->
          <div class="max-w-4xl mx-auto bg-white min-h-[800px] shadow-sm rounded-2xl p-8 sm:p-12 md:p-16 relative overflow-hidden result-container border border-slate-200">
             
             <!-- Print Header -->
             <div class="print-header mb-8 text-center hidden print:block">
                <h1 class="text-xl font-bold">{{ config().appName }}</h1>
                <p class="text-xs text-gray-500">گزارش سیستمی - {{ formData().timeContext }}</p>
             </div>
             
             <!-- Decorative Header Line -->
             <div class="absolute top-0 left-0 w-full h-1 bg-black no-print"></div>

             <!-- Report Meta -->
             <div class="mb-8 border-b border-slate-100 pb-6 no-print">
                <div class="flex flex-wrap items-center gap-3 mb-4">
                   <span class="px-2 py-1 bg-black text-white rounded text-[9px] font-bold tracking-widest uppercase">Strategic Analysis</span>
                   <span class="text-slate-400 text-[10px] font-mono">{{ record()?.dateStr }}</span>
                </div>
                <h1 class="text-2xl md:text-3xl font-bold text-black leading-tight mb-4">{{ formData().subject }}</h1>
                
                <div class="flex flex-wrap gap-3 text-[10px] font-bold text-slate-500">
                   <div class="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                      <lucide-icon name="user" class="w-3 h-3"></lucide-icon>
                      <span>مخاطب: {{ formData().audience }}</span>
                   </div>
                   <div class="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                      <lucide-icon name="check-circle" class="w-3 h-3"></lucide-icon>
                      <span>حوزه: {{ formData().domain }}</span>
                   </div>
                </div>
             </div>

             <!-- Chart: SWOT (If available) -->
             @if (swotData()) {
               <div class="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
                  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 class="text-black font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">نقاط قوت</h4>
                    <ul class="list-disc list-inside text-xs text-slate-600 space-y-1 leading-relaxed">
                      @for (item of swotData().strengths; track item) { <li>{{ item }}</li> }
                    </ul>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 class="text-black font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">نقاط ضعف</h4>
                    <ul class="list-disc list-inside text-xs text-slate-600 space-y-1 leading-relaxed">
                      @for (item of swotData().weaknesses; track item) { <li>{{ item }}</li> }
                    </ul>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 class="text-black font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">فرصت‌ها</h4>
                    <ul class="list-disc list-inside text-xs text-slate-600 space-y-1 leading-relaxed">
                      @for (item of swotData().opportunities; track item) { <li>{{ item }}</li> }
                    </ul>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 class="text-black font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">تهدیدها</h4>
                    <ul class="list-disc list-inside text-xs text-slate-600 space-y-1 leading-relaxed">
                      @for (item of swotData().threats; track item) { <li>{{ item }}</li> }
                    </ul>
                  </div>
               </div>
             }

             <!-- Content -->
             <div class="markdown-content" [innerHTML]="renderedContent()"></div>

             <!-- Footer -->
             <div class="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center no-print opacity-60">
                <div class="flex items-center gap-2">
                   <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Generated by {{ config().appName }}</span>
                </div>
                <span class="text-[9px] font-mono text-slate-300 tracking-widest">CONFIDENTIAL</span>
             </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @media print { .no-print { display: none !important; } .print-only { display: block !important; } }
    
    /* Markdown Styles */
    :host ::ng-deep .markdown-content h1 { @apply text-2xl sm:text-3xl font-black text-slate-900 mb-6 mt-10 border-b pb-2 border-slate-200; }
    :host ::ng-deep .markdown-content h2 { @apply text-xl sm:text-2xl font-black text-slate-800 mb-4 mt-8 flex items-center gap-2; }
    :host ::ng-deep .markdown-content h2::before { content: ''; @apply w-1.5 h-6 bg-indigo-500 rounded-full inline-block; }
    :host ::ng-deep .markdown-content h3 { @apply text-lg sm:text-xl font-bold text-slate-700 mb-3 mt-6; }
    :host ::ng-deep .markdown-content p { @apply text-sm sm:text-base leading-relaxed text-slate-600 mb-4 text-justify; }
    :host ::ng-deep .markdown-content ul { @apply list-disc list-inside mb-4 space-y-2 text-slate-600 text-sm sm:text-base; }
    :host ::ng-deep .markdown-content ol { @apply list-decimal list-inside mb-4 space-y-2 text-slate-600 text-sm sm:text-base; }
    :host ::ng-deep .markdown-content strong { @apply font-black text-slate-800; }
    :host ::ng-deep .markdown-content blockquote { @apply border-r-4 border-indigo-200 bg-indigo-50/50 p-4 rounded-l-xl italic text-slate-600 mb-6 text-sm; }
    :host ::ng-deep .markdown-content table { @apply w-full border-collapse mb-8 mt-4 rounded-xl overflow-hidden shadow-sm border border-slate-200 block overflow-x-auto whitespace-nowrap sm:whitespace-normal; }
    :host ::ng-deep .markdown-content th { @apply bg-slate-100 text-slate-700 font-bold p-3 text-right border-b border-slate-200 text-xs sm:text-sm; }
    :host ::ng-deep .markdown-content td { @apply p-3 border-b border-slate-100 text-slate-600 text-xs sm:text-sm; }
    :host ::ng-deep .markdown-content tr:last-child td { @apply border-b-0; }
  `]
})
export class AnalysisResultComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private historyService = inject(HistoryService);
  private exportService = inject(ExportService);
  private configService = inject(ConfigService);

  config = this.configService.config;
  loading = signal(true);
  record = signal<HistoryRecord | undefined>(undefined);
  
  formData = signal<AnalysisInputs>({} as AnalysisInputs);
  renderedContent = signal('');
  swotData = signal<{ strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[]; } | null>(null);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const rec = await this.historyService.getRecordById(id);
      if (rec && rec.type === 'analysis') {
        this.record.set(rec);
        this.formData.set(rec.inputs as AnalysisInputs);
        this.processContent(rec.result);
      }
    }
    this.loading.set(false);
  }

  processContent(raw: string) {
    // 1. Extract JSON blocks (Charts)
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
    let cleanText = raw;
    let match;

    while ((match = jsonRegex.exec(raw)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        if (data.type === 'swot') {
          this.swotData.set(data.data);
        }
        // Remove the JSON block from text to avoid rendering it
        cleanText = cleanText.replace(match[0], '');
      } catch (e) {
        console.error('Failed to parse chart JSON', e);
      }
    }

    // 2. Render Markdown
    // Configure marked to handle RTL/Persian specifics if needed, but default is usually fine
    const html = marked.parse(cleanText);
    this.renderedContent.set(html as string);
  }

  goBack() {
    if (window.history.length > 1) {
      this.router.navigate(['/history']); 
    } else {
      this.router.navigate(['/analysis']);
    }
  }

  exportToWord() {
    const r = this.record();
    if (!r) return;
    const inputs = this.formData();
    this.exportService.exportToWord(inputs.subject, r.result, {
       'حوزه': inputs.domain,
       'مخاطب': inputs.audience,
       'عمق تحلیل': inputs.depth
    });
  }

  exportToPdf() {
    if (!this.record()) return;
    this.exportService.exportToPdf();
  }
}
