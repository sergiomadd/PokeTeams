import { Routes } from '@angular/router';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { UserPageComponent } from './user-page/user-page.component';

export const userRoutes: Routes = 
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