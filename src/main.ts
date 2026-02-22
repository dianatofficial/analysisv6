import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, BarChart2, ShieldAlert, User, Lock, LogIn, AlertCircle, Shield, History, Sparkles, ChevronDown } from 'lucide-angular';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        BarChart2,
        ShieldAlert,
        User,
        Lock,
        LogIn,
        AlertCircle,
        Shield,
        History,
        Sparkles,
        ChevronDown
      })
    )
  ]
});
