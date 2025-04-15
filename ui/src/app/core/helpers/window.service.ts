import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Device } from '../models/misc/device.enum';

@Injectable({
  providedIn: 'root'
})
export class WindowService 
{
  responsive = inject(BreakpointObserver);

  currentDevice: Device = Device.desktop;
  _currentDevice: BehaviorSubject<Device> = new BehaviorSubject<Device>(Device.desktop);
  currentDevice$: Observable<Device> = this._currentDevice.asObservable();
  readonly DeviceType = Device;

  smallMobileSize: string = '(max-width: 360px)';
  mobileSize: string = '(min-width: 360px) and (max-width: 414px)';
  bigMobile: string = '(min-width: 414px) and (max-width: 480px)';
  tabletPortraitSize: string = '(min-width: 480px) and (max-width: 768px)';
  tabletLandscapeSize: string = '(min-width: 768px) and (max-width: 1024px)';
  laptopSize: string = '(min-width: 1024px) and (max-width: 1600px)'
  desktopSize: string = '(min-width: 1600px)';

  constructor() 
  {
    this.responsive.observe(
      [
        this.smallMobileSize, 
        this.mobileSize, 
        this.bigMobile, 
        this.tabletPortraitSize, 
        this.tabletLandscapeSize, 
        this.laptopSize, 
        this.desktopSize
      ]).subscribe(result => 
    {
      if(result.matches)
      {
        if(result.breakpoints[this.smallMobileSize])
        {
          this.setCurrentDevice(Device.smallMobile);
        }
        else if(result.breakpoints[this.mobileSize])
        {
          this.setCurrentDevice(Device.mobile);
        }
        else if(result.breakpoints[this.bigMobile])
        {
          this.setCurrentDevice(Device.bigMobile);
        }
        else if(result.breakpoints[this.tabletPortraitSize])
        {
          this.setCurrentDevice(Device.tabletPortrait);
        }
        else if(result.breakpoints[this.tabletLandscapeSize])
        {
          this.setCurrentDevice(Device.tabletLandscape);
        }
        else if(result.breakpoints[this.laptopSize])
        {
          this.setCurrentDevice(Device.laptop);
        }
        else if(result.breakpoints[this.desktopSize])
        {
          this.setCurrentDevice(Device.desktop);
        }
      }
    });
  }

  isDesktop(): boolean
  {
    return this.currentDevice === Device.desktop;
  }

  isLaptop(): boolean
  {
    return this.currentDevice === Device.laptop;
  }

  isLaptopOrLess(): boolean
  {
    return this.currentDevice === Device.laptop
      || this.currentDevice === Device.tabletLandscape
      || this.currentDevice === Device.tabletPortrait
      || this.currentDevice === Device.bigMobile
      || this.currentDevice === Device.mobile
      || this.currentDevice === Device.smallMobile;
  }

  isTabletLandscape(): boolean
  {
    return this.currentDevice === Device.tabletLandscape;
  }

  isTabletLandscapeOrLess(): boolean
  {
    return this.currentDevice === Device.tabletLandscape
      || this.currentDevice === Device.tabletPortrait
      || this.currentDevice === Device.bigMobile
      || this.currentDevice === Device.mobile
      || this.currentDevice === Device.smallMobile;
  }

  isTabletPortrait(): boolean
  {
    return this.currentDevice === Device.tabletPortrait;
  }

  isTabletPortraitOrLess(): boolean
  {
    return this.currentDevice === Device.tabletPortrait
      || this.currentDevice === Device.bigMobile
      || this.currentDevice === Device.mobile
      || this.currentDevice === Device.smallMobile;
  }

  isBigMobile(): boolean
  {
    return this.currentDevice === Device.mobile;
  }

  isBigMobileOrLess(): boolean
  {
    return this.currentDevice === Device.bigMobile 
      || this.currentDevice === Device.mobile
      || this.currentDevice === Device.smallMobile;
  }

  isMobile(): boolean
  {
    return this.currentDevice === Device.mobile;
  }

  isMobileOrLess(): boolean
  {
    return this.currentDevice === Device.mobile 
      || this.currentDevice === Device.smallMobile;
  }

  isSmallMobile(): boolean
  {
    return this.currentDevice === Device.smallMobile;
  }

  setCurrentDevice(newDevice: Device)
  {
    this.currentDevice = newDevice;
    this._currentDevice.next(newDevice);
  }
}
