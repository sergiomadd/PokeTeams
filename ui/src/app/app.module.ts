import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth.service';
import { FooterComponent } from './core/layout/footer/footer.component';
import { MenuComponent } from './core/layout/menu/menu.component';
import { TokenInterceptorService } from './core/services/token-interceptor.service';
import { EvolutionComponent } from './features/pokemon/components/evolution/evolution.component';
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
import { TournamentEditorComponent } from './features/team/components/tournament-editor/tournament-editor.component';
import { TeamEditComponent } from './features/team/pages/team-edit/team-edit.component';
import { TeamViewComponent } from './features/team/pages/team-view/team-view.component';
import { UploadComponent } from './features/team/pages/upload/upload.component';
import { UserFormComponent } from './features/user/components/user-form/user-form.component';
import { UserSettingsComponent } from './features/user/components/user-settings/user-settings.component';
import { UserTeamsComponent } from './features/user/components/user-teams/user-teams.component';
import { UserPageComponent } from './features/user/pages/user-page/user-page.component';
import { CheckboxComponent } from './shared/components/checkbox/checkbox.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { DropdownComponent } from './shared/components/dropdown/dropdown.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { RadioComponent } from './shared/components/radio/radio.component';
import { SmartInputComponent } from './shared/components/smart-input/smart-input.component';
import { SwitchComponent } from './shared/components/switch/switch.component';
import { TooltipComponent } from './shared/components/tooltip/tooltip.component';
import { LinkerPipe } from './shared/pipes/linker.pipe';
import { metaReducers } from './store/app.state';

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
    TournamentEditorComponent,
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
    StoreModule.forRoot({}, {metaReducers}),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      //logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
