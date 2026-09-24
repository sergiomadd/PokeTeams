import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global
{
  interface Window
  {
    umami?: { track: (payload?: Record<string, unknown>) => void };
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService
{
  constructor()
  {
    //Only loads on the real production build with a website ID configured, so local dev/test
    //traffic never gets tracked and there's nothing to load when umamiWebsiteId is left empty.
    if (environment.production && environment.umamiWebsiteId)
    {
      this.loadScript(environment.umamiWebsiteId);
    }
  }

  private loadScript(websiteId: string)
  {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://cloud.umami.is/script.js';
    script.setAttribute('data-website-id', websiteId);
    document.head.appendChild(script);
  }
}
