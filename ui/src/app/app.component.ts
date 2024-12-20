import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
  title = 'ui';
  menuOpen: boolean = false;

  constructor() 
  {

  }

  toggleMenu()
  {
    this.menuOpen = !this.menuOpen;
  }
}