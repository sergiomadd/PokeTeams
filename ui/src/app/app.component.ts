import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  constructor() 
  {
    this.seo.updateMetaData();
  }

  toggleMenu()
  {
    this.menuOpen = !this.menuOpen;
  }
}