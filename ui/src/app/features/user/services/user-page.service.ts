import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmailDTO } from '../../../core/models/user/email.dto';
import { User } from '../../../core/models/user/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserPageService 
{
  authService = inject(AuthService);

  private user$: BehaviorSubject<User | undefined>
    = new BehaviorSubject<User | undefined>(undefined);
    user = this.user$.asObservable();

  loggedUserEmail?: EmailDTO;

  constructor() { }

  setUser(user: User | undefined)
  {
    this.user$.next(user);
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
