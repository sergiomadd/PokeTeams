import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
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
import { AuthFormComponent } from './components/layout/auth-form/auth-form.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { MenuComponent } from './components/layout/menu/menu.component';
import { PrivacyPolicyComponent } from './components/layout/privacy-policy/privacy-policy.component';
import { ResetPasswordComponent } from './components/layout/reset-password/reset-password.component';
import { EvolutionComponent } from './components/pokemon/evolution/evolution.component';
import { PokeTooltipComponent } from './components/pokemon/poke-tooltip/poke-tooltip.component';
import { PokemonCardComponent } from './components/pokemon/pokemon-card/pokemon-card.component';
import { PokemonEditorComponent } from './components/pokemon/pokemon-editor/pokemon-editor.component';
import { PokemonIconsComponent } from './components/pokemon/pokemon-icons/pokemon-icons.component';
import { PokemonPreviewComponent } from './components/pokemon/pokemon-preview/pokemon-preview.component';
import { SmartInputComponent } from './components/smart-input/smart-input.component';
import { PasteInputComponent } from './components/team/paste-input/paste-input.component';
import { RegulationPreviewComponent } from './components/team/regulation-preview/regulation-preview.component';
import { TeamBattleComponent } from './components/team/team-battle/team-battle.component';
import { TeamEditorComponent } from './components/team/team-editor/team-editor.component';
import { TeamPreviewComponent } from './components/team/team-preview/team-preview.component';
import { TeamSearchComponent } from './components/team/team-search/team-search.component';
import { TeamTableComponent } from './components/team/team-table/team-table.component';
import { TeamComponent } from './components/team/team/team.component';
import { TournamentPreviewComponent } from './components/team/tournament-preview/tournament-preview.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { GetMoveColorPipe } from './pipes/color-pipes/getMoveColor.pipe';
import { GetStatColorPipe } from './pipes/color-pipes/getStatColor.pipe';
import { GetTagBgColorPipe } from './pipes/color-pipes/getTagBgColor.pipe';
import { GetTagTextColorPipe } from './pipes/color-pipes/getTagTextColor.pipe';
import { GetTypeColorPipe } from './pipes/color-pipes/getTypeColor.pipe';
import { CustomFormatDatePipe } from './pipes/converters/customFormatDate.pipe';
import { FormatCountPipe } from './pipes/converters/formatCount.pipe';
import { GetStatCodePipe } from './pipes/converters/getStatCode.pipe';
import { GetStatShortIdentifierPipe } from './pipes/converters/getStatShortIdentifier.pipe';
import { GetFlagIconUrlPipe } from './pipes/getFlagIconUrl.pipe';
import { GetFormControlErrorPipe } from './pipes/getFormControlError.pipe';
import { IsFormFieldInvalidPipe } from './pipes/isFormFieldInvalid.pipe';
import { CalcMoveEffectivenessPipe } from './pipes/pokemon-pipes/calcMoveEffectiveness.pipe';
import { GetDefenseEffectivenessPipe } from './pipes/pokemon-pipes/getDefenseEffectivenes.pipe';
import { GetPokemonSpritePathPipe } from './pipes/pokemon-pipes/getPokemonSpritePath.pipe';
import { GetPokemonStatBorderRadiusPipe } from './pipes/pokemon-pipes/getPokemonStatBorderRadius.pipe';
import { GetPokemonStatSizePipe } from './pipes/pokemon-pipes/getPokemonStatSize.pipe';
import { ShouldBeInMiddlePipe } from './pipes/pokemon-pipes/shouldBeInMiddle.pipe';

@NgModule({
  declarations: 
  [ 
    PasteInputComponent,
    SmartInputComponent,
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
    ResetPasswordComponent,
    AuthFormComponent,

    //Pipes
    IsFormFieldInvalidPipe,
    GetFormControlErrorPipe,
    TeamBattleComponent,
    CalcMoveEffectivenessPipe,
    GetDefenseEffectivenessPipe,
    PokemonIconsComponent,
    GetPokemonSpritePathPipe,
    GetPokemonStatSizePipe,
    GetPokemonStatBorderRadiusPipe,
    ShouldBeInMiddlePipe,
    GetTypeColorPipe,
    GetMoveColorPipe,
    GetStatColorPipe,
    GetStatCodePipe,
    GetStatShortIdentifierPipe,
    GetTagBgColorPipe,
    GetTagTextColorPipe,
    GetFlagIconUrlPipe,
    CustomFormatDatePipe,
    FormatCountPipe,
  ],
  imports: 
  [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule,
    ClickOutsideDirective,
    GoogleSigninButtonModule
  ],
  exports: 
  [
    //modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    GoogleSigninButtonModule,

    //components
    PasteInputComponent,
    SmartInputComponent,
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
    TeamBattleComponent,

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
    AuthFormComponent,

    //Pipes
    IsFormFieldInvalidPipe,
    GetFormControlErrorPipe,
    CalcMoveEffectivenessPipe,
    GetDefenseEffectivenessPipe,
    GetPokemonSpritePathPipe,
    GetPokemonStatSizePipe,
    GetPokemonStatBorderRadiusPipe,
    ShouldBeInMiddlePipe,
    GetTypeColorPipe,
    GetMoveColorPipe,
    GetStatColorPipe,
    GetStatCodePipe,
    GetStatShortIdentifierPipe,
    GetTagBgColorPipe,
    GetTagTextColorPipe,
    GetFlagIconUrlPipe,
    CustomFormatDatePipe,
    FormatCountPipe,
  ],
  providers: [TranslateStore]
})
export class SharedModule { }

