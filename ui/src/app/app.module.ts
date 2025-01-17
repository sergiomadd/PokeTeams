import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './core/auth/auth.module';
import { AuthService } from './core/auth/services/auth.service';
import { ConfigModule } from './core/config/config.module';
import { FooterComponent } from './core/layout/footer/footer.component';
import { MenuComponent } from './core/layout/menu/menu.component';
import { ErrorInterceptorService } from './core/services/error-interceptor.service';
import { LangInterceptorService } from './core/services/lang-interceptor.service';
import { TokenInterceptorService } from './core/services/token-interceptor.service';
import { metaReducers } from './core/store/app.state';
import { HydrationEffects } from './core/store/hydration/hydration.effects';
import { EvolutionComponent } from './features/pokemon/components/evolution/evolution.component';
import { PokeTooltipComponent } from './features/pokemon/components/poke-tooltip/poke-tooltip.component';
import { PokemonPreviewComponent } from './features/pokemon/components/pokemon-preview/pokemon-preview.component';
import { PokemonComponent } from './features/pokemon/components/pokemon/pokemon.component';
import { TeamSearchComponent } from './features/search/components/team-search/team-search.component';
import { TeamTableComponent } from './features/search/components/team-table/team-table.component';
import { SearchPageComponent } from './features/search/pages/search-page/search-page.component';
import { ColorPickerComponent } from './features/team/components/color-picker/color-picker.component';
import { InputComponent } from './features/team/components/input/input.component';
import { PokemonEditorComponent } from './features/team/components/pokemon-editor/pokemon-editor.component';
import { RegulationSelectorComponent } from './features/team/components/regulation-selector/regulation-selector.component';
import { TagEditorComponent } from './features/team/components/tag-editor/tag-editor.component';
import { TagListComponent } from './features/team/components/tag-list/tag-list.component';
import { TagComponent } from './features/team/components/tag/tag.component';
import { TeamEditorComponent } from './features/team/components/team-editor/team-editor.component';
import { TeamIconsComponent } from './features/team/components/team-icons/team-icons.component';
import { TeamPreviewComponent } from './features/team/components/team-preview/team-preview.component';
import { TeamComponent } from './features/team/components/team/team.component';
import { TeamEditComponent } from './features/team/pages/team-edit/team-edit.component';
import { TeamViewComponent } from './features/team/pages/team-view/team-view.component';
import { UploadComponent } from './features/team/pages/upload/upload.component';
import { EmailConfirmationComponent } from './features/user/components/email-confirmation/email-confirmation.component';
import { UserFormComponent } from './features/user/components/user-form/user-form.component';
import { UserSettingsComponent } from './features/user/components/user-settings/user-settings.component';
import { UserTeamsComponent } from './features/user/components/user-teams/user-teams.component';
import { UserPageComponent } from './features/user/pages/user-page/user-page.component';
import { CheckboxComponent } from './shared/components/checkbox/checkbox.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { DropdownComponent } from './shared/components/dropdown/dropdown.component';
import { NoTranslationComponent } from './shared/components/no-translation/no-translation.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { RadioComponent } from './shared/components/radio/radio.component';
import { SmartInputComponent } from './shared/components/smart-input/smart-input.component';
import { SwitchComponent } from './shared/components/switch/switch.component';
import { TooltipComponent } from './shared/components/tooltip/tooltip.component';
import { LinkerPipe } from './shared/pipes/linker.pipe';
@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
    TeamEditorComponent,
    SwitchComponent,
    DropdownComponent,
    InputComponent,
    TeamViewComponent,
    EvolutionComponent,
    LinkerPipe,
    TeamPreviewComponent,
    PokemonPreviewComponent,
    UserFormComponent,
    TeamIconsComponent,
    DialogComponent,
    MenuComponent,
    SmartInputComponent,
    TooltipComponent,
    PaginationComponent,
    CheckboxComponent,
    RadioComponent,
    TagEditorComponent,
    TagComponent,
    TagListComponent,
    ColorPickerComponent,
    RegulationSelectorComponent,
    PokemonComponent,
    PokemonEditorComponent,
    FooterComponent,
    TeamEditComponent,
    UploadComponent,
    TeamTableComponent,
    TeamSearchComponent,
    SearchPageComponent,
    UserTeamsComponent,
    UserPageComponent,
    UserSettingsComponent,
    NotFoundComponent,
    EmailConfirmationComponent,
    NoTranslationComponent,
    PokeTooltipComponent,
  ],
  exports: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AuthModule,
    ConfigModule,
    StoreModule.forRoot({}, {metaReducers}),
    EffectsModule.forRoot(HydrationEffects),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      //logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    TranslateModule.forRoot(
      {
        loader:
        {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      }),
    ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpLoaderFactory(http: HttpClient)
{
  return new TranslateHttpLoader(http);
}