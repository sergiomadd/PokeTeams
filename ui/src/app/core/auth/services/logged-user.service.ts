import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { User } from 'src/app/features/user/models/user.model';
import { UserService } from 'src/app/features/user/services/user.service';
import { JwtTokenService } from '../../services/jwttoken.service';
import { selectAccessToken } from '../store/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService 
{
  store = inject(Store);
  jwtTokenService = inject(JwtTokenService);
  userService = inject(UserService);

  accessToken$ = this.store.select(selectAccessToken);

  private loggedUser$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  loggedUser = this.loggedUser$.asObservable();
    
  constructor() 
  {
    this.accessToken$.subscribe(async value => 
      {
        if(value) 
        {
          const loggedUsername = this.jwtTokenService.getTokenUsername(value);
          this.setUser(loggedUsername ? await lastValueFrom(this.userService.getUser(loggedUsername)) : undefined)
        }
        else
        {
          this.setUser(undefined);
        }
      })
  }

  setUser(user: User | undefined)
  {
    this.loggedUser$.next(user);
  }
}
