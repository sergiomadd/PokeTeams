import { NgClass } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { ParserService } from '../../../../core/helpers/parser.service';
import { TestService } from '../../../../core/helpers/test.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { selectLang } from '../../../../core/store/config/config.selectors';
import { TeamEditorService } from '../../../services/team-editor.service';
import { TooltipComponent } from '../../dumb/tooltip/tooltip.component';
import { PokemonEditorComponent } from '../../pokemon/pokemon-editor/pokemon-editor.component';

@Component({
    selector: 'app-paste-input',
    templateUrl: './paste-input.component.html',
    styleUrl: './paste-input.component.scss',
    imports: [NgClass, FormsModule, ReactiveFormsModule, TooltipComponent, PokemonEditorComponent, TranslatePipe]
})
export class PasteInputComponent 
{
  pokemonService = inject(PokemonService);
  parser = inject(ParserService);
  teamEditorService = inject(TeamEditorService);
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);
  window = inject(WindowService);
  store = inject(Store);
  testService = inject(TestService);

  selectedLang = this.store.selectSignal(selectLang);

  pasteHolder = signal<string>("");
  pasteBoxFormSubmitted = signal<boolean>(false);
  pasteBoxForm = this.formBuilder.group(
    {
      paste: ["", [Validators.required, Validators.maxLength(2048)]]
    });
  formPaste = toSignal(this.pasteBoxForm.controls.paste.valueChanges, { initialValue: this.pasteBoxForm.controls.paste.value})

  team = this.teamEditorService.team;
  selectedPokemonIndex = signal<number>(0);
  tabs = signal<boolean[]>([true, false]);

  firstRun: boolean = true;

  constructor()
  {
    effect(() => 
    {
      this.selectedLang();
      {
        if(this.firstRun) { this.firstRun = false; return; }
        this.load();
      }
    })
    effect(() =>
    {
      const formPaste = this.formPaste();
      if(formPaste && this.pasteBoxFormSubmitted())
      {
        this.pasteBoxFormSubmitted.set(false);
      }
    })    
  }

  async load()
  {
    this.pasteBoxFormSubmitted.set(true);
    if(this.pasteBoxForm.valid)
    {
      let formData = this.pasteBoxForm.controls.paste.value ?? "";
      let data = this.parser.parsePaste(formData);
      if(data.pokemons && data.pokemons.length > 0)
      {
        this.teamEditorService.updatePokemons([]);
        this.teamEditorService.addPokemonPlaceholders(data.pokemons.length);
        await Promise.all(
          data.pokemons.map(async (pokePaste, index) => 
          {
            const pokemon = await this.pokemonService.buildPokemon(pokePaste);
            if(pokemon) 
            { 
              this.teamEditorService.updatePokemon(pokemon, index, true);
            }
          })
        )
      }
    }
  }

  selectTab(index)
  {
    this.tabs.update(tabs => tabs.map((tab, i) => i === index ? true : false))
    console.log(this.tabs())
  }

  isInvalid(key: string) : boolean
  {
    var control = this.pasteBoxForm.get(key);
    let invalid: boolean = (control?.errors && this.pasteBoxFormSubmitted()) ?? false;
    return invalid;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null =  this.pasteBoxForm.get(key);
    return this.util.getAuthFormError(control);
  }

  reset()
  {
    this.pasteHolder.set("");
    this.pasteBoxForm.controls.paste.setValue("");
    this.pasteBoxFormSubmitted.set(false);
    this.teamEditorService.setEmptyTeam();
  }

  loadExamplePaste()
  {
    if(environment.production)
    {
      this.pasteBoxForm.controls.paste.setValue(this.examplePaste);
      this.load();
      //Place the same id for all example teams to avoid duplication
      this.team.update(team => team && { ...team, title: "Example team", id: "example"})
    }
    else
    {
    /*
    this.testService.getTestForms().subscribe(value => 
      {
        this.pasteHolder = value;
        this.pasteBoxForm.controls.paste.setValue(this.pasteHolder);
      })
    
    */
    this.testService.getTestPaste("testPaste").subscribe(value => 
      {
        this.pasteHolder.set(value);
        this.pasteBoxForm.controls.paste.setValue(this.pasteHolder());
      })
    }
  }

  examplePaste: string = 
  `Arcanine @ Figy Berry
Ability: Intimidate
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Flare Blitz
- Close Combat
- Extreme Speed
- Protect

Venusaur @ Focus Sash
Ability: Chlorophyll
EVs: 252 SpA / 4 SpD / 252 Spe
Modest Nature
IVs: 0 Atk
- Grass Pledge
- Sleep Powder
- Protect
- Sludge Bomb

Gyarados @ Sitrus Berry
Ability: Intimidate
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Power Whip
- Water Spout
- Bounce
- Protect

Rhyperior @ Weakness Policy
Ability: Solid Rock
EVs: 252 HP / 4 Atk / 252 Def
Relaxed Nature
- Rock Slide
- Drill Run
- Fire Blast
- Protect

Machamp @ Assault Vest
Ability: No Guard
EVs: 248 HP / 252 Atk / 8 SpD
Adamant Nature
- Dynamic Punch
- Rock Slide
- Bullet Punch
- Poison Jab

Tyranitar @ Expert Belt
Ability: Sand Stream
EVs: 252 HP / 252 Atk / 4 SpD
Adamant Nature
- Crunch
- Rock Slide
- Protect
- Superpower
`
}
