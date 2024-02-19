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
  deleteDialog: boolean = false;

  chooseEvent($event)
  {
    if($event)
    {
      this.deleteAccount();
      this.deleteDialog = !this.deleteDialog;
    }
    else
    {
      this.deleteDialog = !this.deleteDialog;
    }
  }

  tryDeleteAccout()
  {
    this.deleteDialog = !this.deleteDialog;
  }

  deleteAccount()
  {
    this.store.dispatch(authActions.deleteAccount()); 
  }
  
  logOut()
  {
    this.store.dispatch(authActions.logOut());
  }
}
