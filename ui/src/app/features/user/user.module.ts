import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserTeamsComponent } from './components/user-teams/user-teams.component';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = 
[
  { 
    path: '',
    component: UserPageComponent 
  },
  {
    path: 'emailconfirmation', 
    component: EmailConfirmationComponent 
  }
];

@NgModule({
  declarations: 
  [
    UserPageComponent,
    UserTeamsComponent,
    UserSettingsComponent,
    EmailConfirmationComponent
  ],
  imports: 
  [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class UserModule { }
