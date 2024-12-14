import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserPageService 
{


  private user$: BehaviorSubject<User | undefined>
    = new BehaviorSubject<User | undefined>(undefined);
    user = this.user$.asObservable();

  constructor() { }

  setUser(user: User | undefined)
  {
    this.user$.next(user);
  }
}
