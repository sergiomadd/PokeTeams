import { NgModule, effect, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeamComponent } from './components/team/team.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PokemonComponent } from './components/pokemon/pokemon.component';
import { TeamEditorComponent } from './components/team-editor/team-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from './components/pieces/switch/switch.component';
import { DropdownComponent } from './components/pieces/dropdown/dropdown.component';
import { InputComponent } from './components/input/input.component';
import { VgcComponent } from './components/vgc/vgc.component';
import { TeamViewComponent } from './components/team-view/team-view.component';
import { MainComponent } from './components/main/main.component';
import { LeftOptionComponent } from './components/options/left-option/left-option.component';
import { RightOptionComponent } from './components/options/right-option/right-option.component';
import { EvolutionComponent } from './components/meta/evolution/evolution.component';
import { LinkerPipe } from './pipes/linker.pipe';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { UserComponent } from './components/user/user.component';
import { TeamPreviewComponent } from './components/team-preview/team-preview.component';
import { PokemonPreviewComponent } from './components/pokemon-preview/pokemon-preview.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { TopOptionComponent } from './components/options/top-option/top-option.component';
import { FooterComponent } from './components/footer/footer.component';
import { TeamIconsComponent } from './components/team-icons/team-icons.component';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserTeamsComponent } from './components/user-teams/user-teams.component';
import { DialogComponent } from './components/pieces/dialog/dialog.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AuthModule } from './auth/auth.module';
import { metaReducers } from './state/app.state';
//import { authFeature, authReducer } from './state/auth/auth.reducers';
//import { authReducers } from './state/auth/auth.reducers';



@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
    NavbarComponent,
    PokemonComponent,
    TeamEditorComponent,
    SwitchComponent,
    DropdownComponent,
    InputComponent,
    VgcComponent,
    TeamViewComponent,
    MainComponent,
    LeftOptionComponent,
    RightOptionComponent,
    EvolutionComponent,
    LinkerPipe,
    RightPanelComponent,
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
    DialogComponent
  ],
  exports: [NavbarComponent],
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
