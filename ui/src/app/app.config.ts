import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from "@abacritt/angularx-social-login";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from "@angular/router";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";
import { provideCore } from "./core/core.providers";

export const appConfig: ApplicationConfig = 
{
  providers: 
  [
    provideCore(),
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleId),
          },
        ],
        onError: (err: unknown) => console.error(err),
      } as SocialAuthServiceConfig,
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions() 
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
};