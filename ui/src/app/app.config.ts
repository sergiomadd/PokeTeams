import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from "@angular/router";
import { routes } from "./app.routes";
import { provideCore } from "./core/core.providers";

export const appConfig: ApplicationConfig = 
{
  providers: 
  [
    provideCore(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions() 
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
};