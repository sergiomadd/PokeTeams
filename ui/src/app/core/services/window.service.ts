import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService 
{
  responsive = inject(BreakpointObserver);

  isPhone: boolean = false;

  constructor() 
  {
    this.responsive.observe([Breakpoints.Handset])
    .subscribe(result => 
    {
      console.log(result)
      if(result.matches)
      {
        this.isPhone = true;
      }
    });
  }
}
