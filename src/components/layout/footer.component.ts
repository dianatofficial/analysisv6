
import { Component, inject } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white border-t border-slate-200 py-6 text-center mt-auto">
      <p class="text-slate-500 font-bold text-xs mb-1">&copy; ۱۴۰۴ {{ config().appName }}</p>
      <p class="text-slate-400 text-[10px] font-mono dir-ltr">{{ config().footerText }}</p>
    </footer>
  `,
  styles: [`
    .dir-ltr { direction: ltr; display: inline-block; }
  `]
})
export class FooterComponent {
  configService = inject(ConfigService);
  config = this.configService.config;
}
