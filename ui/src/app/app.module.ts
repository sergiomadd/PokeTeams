import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { MenuComponent } from './core/layout/menu/menu.component';
import { VgcComponent } from './core/layout/vgc/vgc.component';
import { EvolutionComponent } from './features/pokemon/components/evolution/evolution.component';
import { PokemonPreviewComponent } from './features/pokemon/components/pokemon-preview/pokemon-preview.component';
import { PokemonComponent } from './features/pokemon/components/pokemon/pokemon.component';
import { SearchComponent } from './features/search/pages/search/search.component';
import { InputComponent } from './features/team-editor/components/input/input.component';
import { PokemonCreatorComponent } from './features/team-editor/components/pokemon-creator/pokemon-creator.component';
import { TeamEditorComponent } from './features/team-editor/pages/team-editor/team-editor.component';
import { ColorPickerComponent } from './features/team/components/color-picker/color-picker.component';
import { RegulationSelectorComponent } from './features/team/components/regulation-selector/regulation-selector.component';
import { TagEditorComponent } from './features/team/components/tag-editor/tag-editor.component';
import { TagListComponent } from './features/team/components/tag-list/tag-list.component';
import { TagComponent } from './features/team/components/tag/tag.component';
import { TeamIconsComponent } from './features/team/components/team-icons/team-icons.component';
import { TeamPreviewComponent } from './features/team/components/team-preview/team-preview.component';
import { TeamComponent } from './features/team/components/team/team.component';
import { TournamentEditorComponent } from './features/team/components/tournament-editor/tournament-editor.component';
import { TeamViewComponent } from './features/team/pages/team-view/team-view.component';
import { UserDetailsComponent } from './features/user/components/user-details/user-details.component';
import { UserFormComponent } from './features/user/components/user-form/user-form.component';
import { UserOptionsComponent } from './features/user/components/user-options/user-options.component';
import { UserComponent } from './features/user/components/user/user.component';
import { CheckboxComponent } from './shared/components/checkbox/checkbox.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { DropdownComponent } from './shared/components/dropdown/dropdown.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { RadioComponent } from './shared/components/radio/radio.component';
import { SmartInputComponent } from './shared/components/smart-input/smart-input.component';
import { SwitchComponent } from './shared/components/switch/switch.component';
import { TooltipComponent } from './shared/components/tooltip/tooltip.component';
import { LinkerPipe } from './shared/pipes/linker.pipe';
import { metaReducers } from './state/app.state';

@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
    PokemonComponent,
    TeamEditorComponent,
    SwitchComponent,
    DropdownComponent,
    InputComponent,
    VgcComponent,
    TeamViewComponent,
    EvolutionComponent,
    LinkerPipe,
    UserComponent,
    TeamPreviewComponent,
    PokemonPreviewComponent,
    UserFormComponent,
    TeamIconsComponent,
    UserOptionsComponent,
    UserDetailsComponent,
    DialogComponent,
    MenuComponent,
    SearchComponent,
    SmartInputComponent,
    TooltipComponent,
    PaginationComponent,
    PokemonCreatorComponent,
    CheckboxComponent,
    RadioComponent,
    TagEditorComponent,
    TagComponent,
    TagListComponent,
    ColorPickerComponent,
    TournamentEditorComponent,
    RegulationSelectorComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
