import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = 
[
  { 
    path: ':username',
    component: UserPageComponent
  },
  {
    path: ':username/emailconfirmation',
    component: EmailConfirmationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }