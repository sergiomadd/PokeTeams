import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EditorData } from 'src/app/models/editorData.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { ParserService } from 'src/app/services/parser.service';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent 
{
  pokemonService = inject(PokemonService);
  parser = inject(ParserService);
  
  @Input() editorOptions!: EditorOptions;
  @Input() editorData!: EditorData;
  @Output() outPokemon = new EventEmitter<Pokemon>();
  
  formData;
  pasteHolder: string;

  sections: boolean[] = [false, true];

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
    this.formData = new FormGroup({
       paste: new FormControl(this.pasteHolder)
    });
  }

  async onSubmit(formData)
  {
    //const nowAll = new Date().getTime();
    console.log("Submitting: ", formData)
    let data = this.parser.parsePaste(formData.paste);
    for (const pokePaste of data.pokemons)
    {
      this.outPokemon.emit(await this.pokemonService.buildPokemon(pokePaste));
    };
    //console.log("Time to generate pokemons: ", new Date().getTime() - nowAll);
  }

  addPokemon($event)
  {
    this.outPokemon.emit($event);
  }

  select(index)
  {
    for(let i=0;i<this.sections.length;i++)
    {
      this.sections[i] = false;
    }
    this.sections[index] = true;
  }
}
