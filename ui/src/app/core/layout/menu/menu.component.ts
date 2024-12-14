import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { lastValueFrom, Observable } from 'rxjs';
import { authActions } from 'src/app/core/auth/store/auth.actions';
import { selectAccessToken } from 'src/app/core/auth/store/auth.selectors';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { User } from 'src/app/features/user/models/user.model';
import { UserService } from 'src/app/features/user/services/user.service';
import { selectTheme } from '../../config/store/config.selectors';
import { JwtTokenService } from '../../services/jwttoken.service';

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
  jwtTokenService = inject(JwtTokenService)
  userService = inject(UserService);
  themeService = inject(ThemeService);

  @Input() menuOpen: boolean = true;
  @Output() toggleEvent = new EventEmitter();

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  accessToken$ = this.store.select(selectAccessToken);
  loggedUser: User | null = null;

  ngOnInit()
  {
    this.accessToken$.subscribe(async value => 
    {
      if(value) 
      {
        const loggedUsername = this.jwtTokenService.getTokenUsername(value);
        this.loggedUser = loggedUsername ? await lastValueFrom(this.userService.getUser(loggedUsername)) : null;
      }
      else
      {
        this.loggedUser = null;
      }
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
