import { NgModule } from '@angular/core';
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
import { AboutComponent } from './components/about/about.component';
import { MainComponent } from './components/main/main.component';
import { LeftOptionComponent } from './components/options/left-option/left-option.component';
import { RightOptionComponent } from './components/options/right-option/right-option.component';
import { EvolutionComponent } from './components/meta/evolution/evolution.component';


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
    AboutComponent,
    MainComponent,
    LeftOptionComponent,
    RightOptionComponent,
    EvolutionComponent
  ],
  exports: [NavbarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
