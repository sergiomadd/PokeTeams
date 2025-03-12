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

  smallMobileSize: string = '(max-width: 480px)';
  mobileSize: string = '(min-width: 480px) and (max-width: 768px)';
  desktopSize: string = '(min-width: 768px)'

  constructor() 
  {
    this.responsive.observe([this.mobileSize, this.smallMobileSize, this.desktopSize]).subscribe(result => 
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
        else if(result.breakpoints[this.desktopSize])
        {
          this.setCurrentDevice(Device.desktop);
        }
      }
    });
  }

  isMobile(): boolean
  {
    return this.currentDevice === Device.smallMobile || this.currentDevice === Device.mobile;
  }

  setCurrentDevice(newDevice: Device)
  {
    this.currentDevice = newDevice;
    this._currentDevice.next(newDevice);
  }
}
