import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/auth/store/auth.actions';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent 
{
  router = inject(Router)
  store = inject(Store);

  loggedUser$ = this.store.select(selectLoggedUser);

  menuVisible: boolean = true;


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
  }

  logOut()
  {
    this.store.dispatch(authActions.logOut());
  }

  toggleTheme()
  {

  }

  toggleSettings()
  {

  }
}
