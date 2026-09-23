import { inject, Injectable, signal } from '@angular/core';
import { EmailDTO } from '../../../core/models/user/email.dto';
import { User } from '../../../core/models/user/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserPageService
{
  authService = inject(AuthService);

  user = signal<User | undefined>(undefined);

  loggedUserEmail?: EmailDTO;

  constructor() { }

  setUser(user: User | undefined)
  {
    this.user.set(user);
  }

  getloggedUserEmail(user: User | undefined)
  {
    if(user)
    {
      this.authService.getLoggedUserEmail().subscribe((response: EmailDTO) => 
      {
        this.loggedUserEmail = response;
      });
    }
  }
}
