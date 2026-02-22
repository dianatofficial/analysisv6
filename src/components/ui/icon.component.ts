
import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <lucide-icon [name]="name()" [class]="class()"></lucide-icon>
  `,
  host: {
    'class': 'inline-block'
  }
})
export class IconComponent {
  name = input.required<string>();
  class = input<string>('w-6 h-6');


}
