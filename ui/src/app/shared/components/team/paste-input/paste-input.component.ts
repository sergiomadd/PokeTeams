import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ParserService } from 'src/app/core/helpers/parser.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { Team } from 'src/app/core/models/team/team.model';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { selectLang } from 'src/app/core/store/config/config.selectors';
import { TeamEditorService } from 'src/app/shared/services/team-editor.service';

@Component({
  selector: 'app-paste-input',
  templateUrl: './paste-input.component.html',
  styleUrl: './paste-input.component.scss'
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

  selectedLang$: Observable<string> = this.store.select(selectLang);

  pasteBoxFormSubmitted: boolean = false;
  pasteBoxForm = this.formBuilder.group(
    {
      paste: ["", [Validators.required]]
    });
  pasteHolder: string = "";

  team: Team = <Team>{};
  selectedPokemonIndex: number = 0;
  tabs: boolean[] = [true, false];

  constructor()
  {
    
  }

  ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    })
    this.pasteBoxForm.controls.paste.valueChanges.subscribe(value => 
      {
        if(value && this.pasteBoxFormSubmitted)
        {
          this.pasteBoxFormSubmitted = false;
        }
      })
    this.selectedLang$.subscribe(value =>
      {
        if(this.pasteBoxForm.controls.paste.value)
        {
          this.load();
        }
      });
  }

  async load()
  {
    this.pasteBoxFormSubmitted = true;
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
              this.teamEditorService.updatePokemon(pokemon, index);
            }
          })
        )
      }
    }
  }

  selectTab(index)
  {
    for(let i=0;i<this.tabs.length;i++)
    {
      this.tabs[i] = false;
    }
    this.tabs[index] = true;
  }

  isInvalid(key: string) : boolean
  {
    var control = this.pasteBoxForm.get(key);
    let invalid = (control?.errors
      && this.pasteBoxFormSubmitted)
      ?? false;
    return invalid;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null =  this.pasteBoxForm.get(key);
    return this.util.getAuthFormError(control);
  }

  loadExample()
  {

    const testPaste = 
    `
    monito (Garchomp) @ Soul Dew  
    Ability: Technician  
    Level: 78  
    Shiny: Yes  
    Tera Type: Dark  
    EVs: 74 HP / 190 Atk / 91 Def / 48 SpA / 84 SpD / 23 Spe  
    Adamant Nature  
    IVs: 24 HP / 12 Atk / 30 Def / 16 SpA / 23 SpD / 5 Spe  
    - Scary Face  
    - Smack Down  
    - Sunny Day  
    - Sunny Day

    Pickle (Mamoswine) (F) @ Never-Melt Ice
    Ability: Thick Fat
    Shiny: Yes
    EVs: 252 Atk / 4 SpD / 252 Spe
    Jolly Nature
    - Ice Shard
    - Earthquake
    - Icicle Crash
    - Knock Off

    Kyogre @ Mystic Water
    Ability: Drizzle
    Level: 100
    EVs: 116 HP / 28 Def / 108 SpA / 4 SpD / 252 Spe
    Timid Nature
    IVs: 0 Atk
    - Water Spout
    - Origin Pulse
    - Ice Beam
    - Protect

    monito (Eevee) @ Soul Dew  
    Ability: Technician  
    Level: 49  
    Shiny: Yes  
    Tera Type: Dark  
    EVs: 25 HP / 25 Atk / 25 Def / 25 SpA / 25 SpD / 25 Spe  
    Bashful Nature  
    IVs: 7 Atk / 6 Def / 9 SpD / 4 Spe 
    - Scary Face  
    - Smack Down  
    - Sunny Day  
    - Sunny Day

    monito (Charmander) @ Soul Dew  
    Ability: Technician  
    Level: 49  
    Shiny: Yes  
    Tera Type: Dark  
    EVs: 25 HP / 25 Atk / 25 Def / 25 SpA / 25 SpD / 25 Spe  
    Bashful Nature  
    IVs: 7 Atk / 6 Def / 9 SpD / 4 Spe 
    - Scary Face  
    - Smack Down  
    - Sunny Day  
    - Sunny Day

    monito (Metagross) @ Soul Dew  
    Ability: Technician  
    Level: 49  
    Shiny: Yes  
    Tera Type: Dark  
    EVs: 25 HP / 25 Atk / 25 Def / 25 SpA / 25 SpD / 25 Spe  
    Bashful Nature  
    IVs: 7 Atk / 6 Def / 9 SpD / 4 Spe 
    - Scary Face  
    - Smack Down  
    - Sunny Day  
    - Sunny Day
    `

    const one = 
    `
Zacian @ Banda Focus 
Ability: Intrepid Sword  
Level: 50  
Shiny: Yes  
EVs: 236 HP / 76 Atk / 4 Def / 4 SpD / 188 Spe  
Adamant Nature  
- Behemoth Blade  
- Play Rough  
- Sacred Sword  
- Protect  `

    const propaste = 
    `
Zacian @ Banda Focus 
Ability: Intrepid Sword  
Level: 50  
Shiny: Yes  
EVs: 236 HP / 76 Atk / 4 Def / 4 SpD / 188 Spe  
Adamant Nature  
- Behemoth Blade  
- Play Rough  
- Sacred Sword  
- Protect  

Kyogre @ Mystic Water  
Ability: Drizzle  
Level: 50  
EVs: 116 HP / 28 Def / 108 SpA / 4 SpD / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Water Spout  
- Origin Pulse  
- Ice Beam  
- Protect  

Kartana @ Assault Vest  
Ability: Beast Boost  
Level: 50  
Shiny: Yes  
EVs: 4 HP / 4 Atk / 4 Def / 244 SpD / 252 Spe  
Jolly Nature  
- Leaf Blade  
- Smart Strike  
- Sacred Sword  
- Aerial Ace  

Shedinja @ Focus Sash  
Ability: Wonder Guard  
Level: 50  
EVs: 252 Atk / 252 Spe  
Lonely Nature  
IVs: 0 Def / 0 SpD  
- Poltergeist  
- Shadow Sneak  
- Endure  
- Ally Switch  

Incineroar @ Shuca Berry  
Ability: Intimidate  
Level: 50  
Shiny: Yes  
EVs: 252 HP / 4 Atk / 108 Def / 132 SpD / 12 Spe  
Impish Nature  
IVs: 0 SpA  
- Flare Blitz  
- Darkest Lariat  
- Parting Shot  
- Fake Out  

Thundurus @ Sitrus Berry  
Ability: Prankster  
Level: 50  
EVs: 236 HP / 140 Def / 4 SpA / 76 SpD / 52 Spe  
Calm Nature  
IVs: 0 Atk  
- Thunderbolt  
- Taunt  
- Eerie Impulse  
- Thunder Wave  
`

const test4 = 
`
Miraidon @ Choice Scarf  
Ability: Hadron Engine  
Level: 50  
Tera Type: Electric  
EVs: 4 Def / 252 SpA / 252 Spe  
Modest Nature  
- Electro Drift  
- Draco Meteor  
- Volt Switch  
- Snarl  

Calyrex-Ice @ Clear Amulet  
Ability: As One (Glastrier)  
Level: 50  
Tera Type: Water  
EVs: 252 HP / 116 Atk / 4 Def / 84 SpD / 52 Spe  
Adamant Nature  
- Glacial Lance  
- High Horsepower  
- Trick Room  
- Protect  

Iron Valiant @ Booster Energy  
Ability: Quark Drive  
Level: 50  
Tera Type: Ghost  
EVs: 252 HP / 4 Atk / 68 Def / 44 SpD / 140 Spe  
Jolly Nature  
- Spirit Break  
- Encore  
- Disable  
- Protect  

Volcarona @ Rocky Helmet  
Ability: Flame Body  
Level: 50  
Tera Type: Water  
EVs: 252 HP / 220 Def / 4 SpA / 4 SpD / 28 Spe  
Bold Nature  
IVs: 0 Atk  
- Fiery Dance  
- Rage Powder  
- Will-O-Wisp  
- Tailwind  

Urshifu-Rapid-Strike @ Focus Sash  
Ability: Unseen Fist  
Level: 50  
Tera Type: Stellar  
EVs: 252 Atk / 4 SpD / 252 Spe  
Adamant Nature  
- Surging Strikes  
- Close Combat  
- Aqua Jet  
- Detect  

Farigiraf @ Electric Seed  
Ability: Armor Tail  
Level: 50  
Tera Type: Dark  
EVs: 236 HP / 108 Def / 4 SpA / 148 SpD / 12 Spe  
Bold Nature  
IVs: 0 Atk  
- Psychic  
- Foul Play  
- Helping Hand  
- Trick Room  

`
    this.pasteHolder = propaste;
    this.pasteBoxForm.controls.paste.setValue(this.pasteHolder);
  }
}
