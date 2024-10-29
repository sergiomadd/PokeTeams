import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Pokemon } from 'src/app/features/pokemon/models/pokemon.model';
import { PokemonService } from 'src/app/features/pokemon/services/pokemon.service';
import { Team } from 'src/app/features/team/models/team.model';
import { ParserService } from 'src/app/shared/services/parser.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { TeamEditorService } from '../../services/team-editor.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent 
{
  pokemonService = inject(PokemonService);
  parser = inject(ParserService);
  teamEditorService = inject(TeamEditorService);
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);

  pasteBoxFormSubmitted: boolean = false;
  pasteBoxForm = this.formBuilder.group(
    {
      paste: ["", [Validators.required]]
    });
  pasteHolder: string;
  team: Team = <Team>{};
  selectedPokemonIndex: number = 0;
  tabs: boolean[] = [true, false];

  constructor()
  {
    this.pasteHolder = 
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
  }

  ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    })
  }

  async load()
  {
    //const nowAll = new Date().getTime();
    this.pasteBoxFormSubmitted = true;
    console.log(this.isInvalid('paste'))
    if(this.pasteBoxForm.valid)
    {
      let formData = this.pasteBoxForm.controls.paste.value ?? "";
      console.log("Submitting: ", formData)
      let data = this.parser.parsePaste(formData);
      console.log("Parsed data: ", data)
      if(data.pokemons && data.pokemons.length > 0)
      {
        this.teamEditorService.updatePokemons([]);
        for (const pokePaste of data.pokemons)
        {
          const pokemon: Pokemon = await this.pokemonService.buildPokemon(pokePaste);
          this.teamEditorService.addPokemon(pokemon);
        };
      }
    }
    //console.log("Time to generate pokemons: ", new Date().getTime() - nowAll);
  }

  addEmptyPokemon()
  {
    this.teamEditorService.addEmptyPokemon();
  }

  deletePokemon($event)
  {
    this.teamEditorService.deletePokemon($event);
  }

  selectTab(index)
  {
    for(let i=0;i<this.tabs.length;i++)
    {
      this.tabs[i] = false;
    }
    this.tabs[index] = true;
  }

  selectPokemon(index: number)
  {
    if(index != this.selectedPokemonIndex)
    {
      this.selectedPokemonIndex = index;
    }
  }

  isInvalid(key: string) : boolean
  {
    var control = this.pasteBoxForm.get(key);
    let invalid = (control?.errors
      && (control?.dirty || control?.touched
        || this.pasteBoxFormSubmitted))
      ?? false;
    return invalid;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null =  this.pasteBoxForm.get(key);
    return this.util.getAuthFormError(control);
  }
}
