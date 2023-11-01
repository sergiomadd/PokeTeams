import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Pokemon } from 'src/app/models/pokemon.model';
import { GetPokemonService } from 'src/app/services/get-pokemon.service';
import { parsePaste } from 'src/app/services/parsePaste';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent 
{
  getPokemon = inject(GetPokemonService);
  @Output() outPokemons = new EventEmitter<Promise<Pokemon[]>>();
  pokemons!: Promise<Pokemon[]>;

  formData;
  pasteHolder: string;

  constructor()
  {
    this.pasteHolder = 
    `
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
    Level: 50
    EVs: 116 HP / 28 Def / 108 SpA / 4 SpD / 252 Spe
    Timid Nature
    IVs: 0 Atk
    - Water Spout
    - Origin Pulse
    - Ice Beam
    - Protect

    monito (Ambipom) @ Soul Dew  
    Ability: Technician  
    Level: 56  
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

  onSubmit(formData)
  {
    console.log("submittinh", formData)
    let data = parsePaste(formData.paste);
    this.pokemons = this.getPokemon.buildPokemon(data);
    console.log("pokes", this.pokemons)
    this.outPokemons.emit(this.pokemons);
  }
}
