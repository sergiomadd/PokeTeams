import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserTeamsComponent } from './components/user-teams/user-teams.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UserRoutingModule } from './user-routing.module';

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
    UserRoutingModule
  ]
})
export class UserModule { }
