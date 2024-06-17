import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/auth/store/auth.actions';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
import { ThemeService } from 'src/app/services/theme.service';

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

  loggedUser$ = this.store.select(selectLoggedUser);

  menuVisible: boolean = true;
  selectedThemeName?: string;

  ngOnInit()
  {
    this.themes.selectedTheme$?.subscribe(value => 
      {
        this.selectedThemeName = value.name;
      });
  }

  toggleMenu()
  {
    this.menuVisible = !this.menuVisible;
  }

  navigate(pageName:string)
  {
    this.router.navigate([`${pageName}`]);
  }

  navigateLoggedUser(username)
  {
    //this.loggedUser$.subscribe()
    this.router.navigate([`/@${username}`]);
    console.log(username.which)
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
