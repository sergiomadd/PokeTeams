import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';
import { CheckboxComponent } from './components/dumb/checkbox/checkbox.component';
import { ChipComponent } from './components/dumb/chip/chip.component';
import { ColorPickerComponent } from './components/dumb/color-picker/color-picker.component';
import { DialogComponent } from './components/dumb/dialog/dialog.component';
import { DropdownComponent } from './components/dumb/dropdown/dropdown.component';
import { NoTranslationComponent } from './components/dumb/no-translation/no-translation.component';
import { NotFoundComponent } from './components/dumb/not-found/not-found.component';
import { PaginationComponent } from './components/dumb/pagination/pagination.component';
import { RadioComponent } from './components/dumb/radio/radio.component';
import { SwitchComponent } from './components/dumb/switch/switch.component';
import { TagEditorComponent } from './components/dumb/tag-editor/tag-editor.component';
import { TooltipComponent } from './components/dumb/tooltip/tooltip.component';
import { AboutComponent } from './components/layout/about/about.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { MenuComponent } from './components/layout/menu/menu.component';
import { PrivacyPolicyComponent } from './components/layout/privacy-policy/privacy-policy.component';
import { UserFormComponent } from './components/layout/user-form/user-form.component';
import { EvolutionComponent } from './components/pokemon/evolution/evolution.component';
import { PokeTooltipComponent } from './components/pokemon/poke-tooltip/poke-tooltip.component';
import { PokemonCardComponent } from './components/pokemon/pokemon-card/pokemon-card.component';
import { PokemonEditorComponent } from './components/pokemon/pokemon-editor/pokemon-editor.component';
import { PokemonPreviewComponent } from './components/pokemon/pokemon-preview/pokemon-preview.component';
import { SmartInputComponent } from './components/smart-input/smart-input.component';
import { PasteInputComponent } from './components/team/paste-input/paste-input.component';
import { TeamEditorComponent } from './components/team/team-editor/team-editor.component';
import { TeamPreviewComponent } from './components/team/team-preview/team-preview.component';
import { TeamSearchComponent } from './components/team/team-search/team-search.component';
import { TeamTableComponent } from './components/team/team-table/team-table.component';
import { TeamComponent } from './components/team/team/team.component';
import { TournamentPreviewComponent } from './components/team/tournament-preview/tournament-preview.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { RegulationPreviewComponent } from './components/team/regulation-preview/regulation-preview.component';
import { ResetPasswordComponent } from './components/layout/reset-password/reset-password.component';

@NgModule({
  declarations: 
  [ 
    PasteInputComponent,
    SmartInputComponent,
    UserFormComponent,
    MenuComponent,
    FooterComponent,

    //pokemon
    PokemonCardComponent,
    EvolutionComponent,
    PokeTooltipComponent,
    PokemonPreviewComponent,
    PokemonEditorComponent,

    //team
    TeamComponent,
    TeamPreviewComponent,
    TeamEditorComponent,
    TeamSearchComponent,
    TeamTableComponent,

    //dumb
    CheckboxComponent,
    ChipComponent,
    ColorPickerComponent,
    DialogComponent,
    DropdownComponent,
    NoTranslationComponent,
    NotFoundComponent,
    PaginationComponent,
    RadioComponent,
    SwitchComponent,
    TagEditorComponent,
    TooltipComponent,
    PokemonCardComponent,
    TournamentPreviewComponent,
    PrivacyPolicyComponent,
    AboutComponent,
    RegulationPreviewComponent,
    ResetPasswordComponent
  ],
  imports: 
  [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule,
    ClickOutsideDirective
  ],
  exports: 
  [
    //modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,

    //components
    PasteInputComponent,
    SmartInputComponent,
    UserFormComponent,
    MenuComponent,
    FooterComponent,

    //pokemon
    PokemonCardComponent,
    EvolutionComponent,
    PokeTooltipComponent,
    PokemonPreviewComponent,
    PokemonEditorComponent,

    //team
    TeamComponent,
    TeamPreviewComponent,
    TeamEditorComponent,
    TeamSearchComponent,
    TeamTableComponent,

    //dumb
    CheckboxComponent,
    ChipComponent,
    ColorPickerComponent,
    DialogComponent,
    DropdownComponent,
    NoTranslationComponent,
    NotFoundComponent,
    PaginationComponent,
    RadioComponent,
    SwitchComponent,
    TagEditorComponent,
    TooltipComponent,
  ],
  providers: [TranslateStore]
})
export class SharedModule { }

