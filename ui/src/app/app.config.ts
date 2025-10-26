import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from "@angular/router";
import { routes } from "./app.routes";
import { CoreModule } from "./core/core.module";

export const appConfig: ApplicationConfig = 
{
  providers: 
  [
    importProvidersFrom(CoreModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions() 
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
};