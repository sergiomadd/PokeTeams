import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserTeamsComponent } from './components/user-teams/user-teams.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    imports: [
        CommonModule,
        UserRoutingModule,
        UserPageComponent,
        UserTeamsComponent,
        UserSettingsComponent,
        EmailConfirmationComponent
    ]
})
export class UserModule { }
