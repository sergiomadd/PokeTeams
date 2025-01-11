import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService 
{
  responsive = inject(BreakpointObserver);

  isMobile: boolean = false; //600px
  isMiniMobile: boolean = false;

  mobileSize: string = '(max-width: 768px)';
  miniMobileSize: string = '(max-width: 480px)';

  constructor() 
  {
    this.responsive.observe([this.mobileSize, this.miniMobileSize])
    .subscribe(result => 
    {
      console.log(result)
      this.isMiniMobile = false;
      if(result.matches)
      {
        this.isMobile = result.breakpoints[this.mobileSize];
        this.isMiniMobile = result.breakpoints[this.miniMobileSize];
      }
    });
  }
}
