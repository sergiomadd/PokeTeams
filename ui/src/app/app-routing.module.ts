import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SearchComponent } from './components/search/search.component';
import { TeamViewComponent } from './components/team-view/team-view.component';
import { UserComponent } from './components/user/user.component';


const routes: Routes = [
  { path: '', component: MainComponent},
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
  { path: ':id', component: TeamViewComponent },
  //{path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }