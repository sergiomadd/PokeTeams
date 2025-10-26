import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UploadPageComponent } from './features/upload-page/upload-page.component';
import { NotFoundComponent } from './shared/components/dumb/not-found/not-found.component';
import { AboutComponent } from './shared/components/layout/about/about.component';
import { PrivacyPolicyComponent } from './shared/components/layout/privacy-policy/privacy-policy.component';
import { ResetPasswordComponent } from './shared/components/layout/reset-password/reset-password.component';

export const routes: Routes = 
[
  { 
    path: '',
    component: UploadPageComponent
  },
  { 
    path: 'search',
    loadComponent: () => import('./features/search-page/search-page.component').then((c) => c.SearchPageComponent),
  },
  { 
    path: 'compare',
    loadComponent: () => import('./features/compare-page/compare-page.component').then((c) => c.ComparePageComponent),
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes').then((r) => r.userRoutes),
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'reset',
    component: ResetPasswordComponent,
  },
  { 
    path: 'edit/:id',
    loadComponent: () => import('./features/team-edit-page/team-edit-page.component').then((c) => c.TeamEditPageComponent),
    canActivate: [authGuard]  
  },
  { 
    path: ':id',
    loadComponent: () => import('./features/team-view-page/team-view-page.component').then((c) => c.TeamViewPageComponent),
  },
  {
    path: '**', component: NotFoundComponent
  }
];