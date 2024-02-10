import { Component, inject } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { User } from './models/user.model';
import { Store } from '@ngrx/store';
import { authActions } from './state/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
  title = 'ui';
  store = inject(Store);

  ngOnInit()
  {
    this.store.dispatch(authActions.getLogged());
  }
}