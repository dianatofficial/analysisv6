
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { AnalysisComponent } from './components/analysis.component';
import { AnalysisResultComponent } from './components/analysis-result.component';
import { ScenarioComponent } from './components/scenario.component';
import { ScenarioResultComponent } from './components/scenario-result.component';
import { HistoryComponent } from './components/history.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserPanelComponent } from './components/user-panel.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // Ensure we have a session if token exists in local storage
  if (!authService.currentUser()) {
     router.navigate(['/login']);
     return false;
  }
  return true;
};

const adminGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  if (!authService.currentUser() || !authService.isAdmin()) {
    router.navigate(['/analysis']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'analysis', component: AnalysisComponent, canActivate: [authGuard] },
  { path: 'analysis/result/:id', component: AnalysisResultComponent, canActivate: [authGuard] },
  { path: 'scenario', component: ScenarioComponent, canActivate: [authGuard] },
  { path: 'scenario/result/:id', component: ScenarioResultComponent, canActivate: [authGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [authGuard] },
  { path: 'profile', component: UserPanelComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
