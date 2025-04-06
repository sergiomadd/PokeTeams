import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { NotFoundComponent } from './shared/components/dumb/not-found/not-found.component';

const routes: Routes = 
[
  { 
    path: '',
    loadChildren: () => import('./features/upload/upload.module').then((m) => m.UploadModule),
    pathMatch: 'full'
  },
  { 
    path: 'search',
    loadChildren: () => import('./features/search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.module').then((m) => m.UserModule)
  },
  { 
    path: 'edit/:id',
    loadChildren: () => import('./features/team-edit/team-edit.module').then((m) => m.TeamEditModule),
    canActivate: [authGuard]  
  },
  { 
    path: ':id',
    loadChildren: () => import('./features/team-view/team-view.module').then((m) => m.TeamViewModule),
  },
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: 
  [
    RouterModule.forRoot(routes, { bindToComponentInputs: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }