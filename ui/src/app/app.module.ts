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
import { FooterComponent } from './components/footer/footer.component';
import { InputComponent } from './components/input/input.component';
import { MainComponent } from './components/main/main.component';
import { MenuComponent } from './components/menu/menu.component';
import { EvolutionComponent } from './components/meta/evolution/evolution.component';
import { RightOptionComponent } from './components/options/right-option/right-option.component';
import { TopOptionComponent } from './components/options/top-option/top-option.component';
import { DialogComponent } from './components/pieces/dialog/dialog.component';
import { DropdownComponent } from './components/pieces/dropdown/dropdown.component';
import { MultiSearchComponent } from './components/pieces/multi-search/multi-search.component';
import { PaginationComponent } from './components/pieces/pagination/pagination.component';
import { ResultStorageComponent } from './components/pieces/result-storage/result-storage.component';
import { SmartInputComponent } from './components/pieces/smart-input/smart-input.component';
import { SwitchComponent } from './components/pieces/switch/switch.component';
import { TooltipComponent } from './components/pieces/tooltip/tooltip.component';
import { PokemonCreatorComponent } from './components/pokemon-creator/pokemon-creator.component';
import { PokemonPreviewComponent } from './components/pokemon-preview/pokemon-preview.component';
import { PokemonComponent } from './components/pokemon/pokemon.component';
import { SearchComponent } from './components/search/search.component';
import { TeamEditorComponent } from './components/team-editor/team-editor.component';
import { TeamIconsComponent } from './components/team-icons/team-icons.component';
import { TeamPreviewComponent } from './components/team-preview/team-preview.component';
import { TeamViewComponent } from './components/team-view/team-view.component';
import { TeamComponent } from './components/team/team.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { UserTeamsComponent } from './components/user-teams/user-teams.component';
import { UserComponent } from './components/user/user.component';
import { VgcComponent } from './components/vgc/vgc.component';
import { LinkerPipe } from './pipes/linker.pipe';
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
    MainComponent,
    RightOptionComponent,
    EvolutionComponent,
    LinkerPipe,
    UserComponent,
    TeamPreviewComponent,
    PokemonPreviewComponent,
    UserFormComponent,
    TopOptionComponent,
    FooterComponent,
    TeamIconsComponent,
    UserOptionsComponent,
    UserDetailsComponent,
    UserTeamsComponent,
    DialogComponent,
    MultiSearchComponent,
    MenuComponent,
    SearchComponent,
    SmartInputComponent,
    ResultStorageComponent,
    TooltipComponent,
    PaginationComponent,
    PokemonCreatorComponent
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
