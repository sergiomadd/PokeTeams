import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/state/auth/auth.actions';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss']
})
export class UserOptionsComponent 
{
  store = inject(Store);

  deleteAccount()
  {
    
  }
  
  logOut()
  {
    this.store.dispatch(authActions.logOut());
  }
}
