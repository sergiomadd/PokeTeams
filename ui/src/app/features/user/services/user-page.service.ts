import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserPageService 
{

  private user$: BehaviorSubject<User>
    = new BehaviorSubject<User>(<User>{});
    user = this.user$.asObservable();

  constructor() { }

  setUser(user: User)
  {
    this.user$.next(user);
  }
}
