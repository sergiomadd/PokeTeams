import { SocialAuthService } from '@abacritt/angularx-social-login';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsService } from './core/helpers/analytics.service';
import { SeoService } from './core/helpers/seo.service';
import { FooterComponent } from './shared/components/layout/footer/footer.component';
import { MenuComponent } from './shared/components/layout/menu/menu.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [NgClass, RouterOutlet, MenuComponent, FooterComponent]
})
export class AppComponent
{
  title = 'PokeTeams';
  menuOpen: boolean = false;
  seo = inject(SeoService);

  //Injecting SocialAuthService here (root component, created at app bootstrap) kicks off
  //Google's SDK load in the background early, so it's already ready by the time the user
  //opens the login form instead of only starting to load at that point.
  socialAuthService = inject(SocialAuthService);

  //Injecting here (root component, created once at bootstrap) kicks off the analytics
  //script load, if configured, a single time for the whole app lifetime.
  analytics = inject(AnalyticsService);

  constructor()
  {
    this.seo.updateMetaData();
  }

  toggleMenu()
  {
    this.menuOpen = !this.menuOpen;
  }
}