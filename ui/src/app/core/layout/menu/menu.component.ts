import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { authActions } from 'src/app/core/auth/store/auth.actions';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { User } from 'src/app/features/user/models/user.model';
import { LoggedUserService } from '../../auth/services/logged-user.service';
import { selectTheme } from '../../config/store/config.selectors';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent 
{
  router = inject(Router)
  store = inject(Store);
  themes = inject(ThemeService);
  themeService = inject(ThemeService);
  loggedUserService = inject(LoggedUserService);

  @Input() menuOpen: boolean = true;
  @Output() toggleEvent = new EventEmitter();

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  loggedUser?: User;

  ngOnInit()
  { 
    this.loggedUserService.loggedUser.subscribe(value =>
      {
        this.loggedUser = value;
      })
  }

  toggleMenu()
  {
    this.toggleEvent.emit()
  }

  navigate(pageName:string)
  {
    this.router.navigate([`${pageName}`]);
  }

  navigateLoggedUser(username)
  {
    this.router.navigate([`/@${username}`]);
  }

  logOut()
  {
    this.store.dispatch(authActions.logOut());
  }

  toggleTheme()
  {
    this.themeService.toggleTheme();
  }

  toggleSettings()
  {

  }
}
