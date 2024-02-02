import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss']
})
export class UserOptionsComponent 
{
  user?: User;

  logOut()
  {
    
  }

  deleteAccount()
  {
    
  }
}
