import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { authActions } from 'src/app/auth/store/auth.actions';
import { selectUser } from 'src/app/auth/store/auth.selectors';
import { ThemeService } from 'src/app/core/services/theme.service';
import { User } from 'src/app/features/user/models/user.model';
import { UserService } from 'src/app/features/user/services/user.service';
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

  @Input() menuOpen: boolean = true;
  @Output() toggleEvent = new EventEmitter();

  loggedUser$: Observable<User | null> = this.store.select(selectUser);
  loggedUser: User | null = null;
  selectedThemeName?: string;

  ngOnInit()
  {
    this.loggedUser$.subscribe(async value => 
    {
      this.loggedUser = value;
    })

    this.themes.selectedTheme$?.subscribe(value => 
      {
        this.selectedThemeName = value.name;
      });
    //this.toggleTheme();
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
    this.themes.switchThemes();
  }

  toggleSettings()
  {

  }
}
