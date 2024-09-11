import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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

  @Input() menuOpen: boolean = true;
  @Output() toggleEvent = new EventEmitter()

  showUserForm: boolean = false;
  selectedThemeName?: string;

  ngOnInit()
  {
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
    //this.loggedUser$.subscribe()
    this.router.navigate([`/@${username}`]);
  }

  toggleUserForm()
  {
    if(!this.menuOpen) { this.toggleMenu(); }
    this.showUserForm = !this.showUserForm;
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
