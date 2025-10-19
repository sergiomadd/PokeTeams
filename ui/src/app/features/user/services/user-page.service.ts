import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { EmailDTO } from '../models/email.dto';
import { User } from '../models/user.model';

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
