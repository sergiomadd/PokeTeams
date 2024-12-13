import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { SearchPageComponent } from './features/search/pages/search-page/search-page.component';
import { TeamEditComponent } from './features/team/pages/team-edit/team-edit.component';
import { TeamViewComponent } from './features/team/pages/team-view/team-view.component';
import { UploadComponent } from './features/team/pages/upload/upload.component';
import { EmailConfirmationComponent } from './features/user/components/email-confirmation/email-confirmation.component';
import { UserPageComponent } from './features/user/pages/user-page/user-page.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';


const routes: Routes = [
  { path: '', component: UploadComponent},
  { path: 'search', component: SearchPageComponent},
  { path: 'emailconfirmation', component: EmailConfirmationComponent },
  {
    matcher: (url) => 
    {
      if (url.length === 1 && url[0].path.includes('@')) 
      {
        return {consumed: url, posParams: {username: new UrlSegment(url[0].path.slice(1), {})}};
      }
      return null;
    },
    component: UserPageComponent
  },
  { path: 'edit/:id', component: TeamEditComponent },
  { path: ':id', component: TeamViewComponent },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }