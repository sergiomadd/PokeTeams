import { Component, inject } from '@angular/core';
import { SeoService } from './core/helpers/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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