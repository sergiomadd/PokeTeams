import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { HomeComponent } from './core/pages/home/home.component';
import { SearchComponent } from './features/search/pages/search/search.component';
import { TeamEditComponent } from './features/team/pages/team-edit/team-edit.component';
import { TeamViewComponent } from './features/team/pages/team-view/team-view.component';
import { UserComponent } from './features/user/components/user/user.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'search', component: SearchComponent},
  {
    matcher: (url) => 
    {
      if (url.length === 1 && url[0].path.includes('@')) 
      {
        return {consumed: url, posParams: {userName: new UrlSegment(url[0].path.slice(1), {})}};
      }
      return null;
    },
    component: UserComponent
  },
  { path: 'edit/:id', component: TeamEditComponent },
  { path: ':id', component: TeamViewComponent },
  //{path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }