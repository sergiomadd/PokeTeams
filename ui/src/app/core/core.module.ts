import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { ErrorInterceptorService } from './interceptors/error-interceptor.service';
import { LangInterceptorService } from './interceptors/lang-interceptor.service';
import { AuthService } from './services/auth.service';
import { PokemonService } from './services/pokemon.service';
import { QueryService } from './services/query.service';
import { TeamService } from './services/team.service';
import { UserService } from './services/user.service';
import { metaReducers } from './store/app.state';
import { AuthEffects } from './store/auth/auth.effects';
import { authReducers } from './store/auth/auth.reducers';
import { ConfigEffects } from './store/config/config.effects';
import { configReducers } from './store/config/config.reducers';
import { HydrationEffects } from './store/hydration/hydration.effects';

@NgModule({
  declarations: [],
  imports: 
  [
    CommonModule,
    HttpClientModule,
    SocialLoginModule,
    StoreModule.forRoot({}, {metaReducers}),
    EffectsModule.forRoot(HydrationEffects),

    StoreModule.forFeature("auth", authReducers),
    EffectsModule.forFeature([AuthEffects]),

    StoreModule.forFeature('config', configReducers),
    EffectsModule.forFeature([ConfigEffects]),

    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      //logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: 
  [
    AuthService,
    PokemonService,
    TeamService,
    UserService,
    QueryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LangInterceptorService, 
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleId)
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  exports: [TranslateModule]
})
export class CoreModule { }

export function httpLoaderFactory(http: HttpClient)
{
  return new TranslateHttpLoader(http);
}