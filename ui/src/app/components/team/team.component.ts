import { Component, inject } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { parsePaste } from 'src/app/services/parsePaste';
import { GetPokemonService } from 'src/app/services/get-pokemon.service';
import { PokePasteData } from '../../models/pokePasteData.model';

@Component({
  selector: 'app-team',
  template: `
  <div class="team">
    <div class="pokemons" *ngFor="let pokemon of (pokemons| async)">
      <app-pokemon [pokemon]="pokemon"></app-pokemon>
    </div>
    <div class="pokemons" *ngFor="let pokemon of (pokemons| async)">
      <app-pokemon [pokemon]="pokemon"></app-pokemon>
    </div>
    <div class="pokemons" *ngFor="let pokemon of (pokemons| async)">
      <app-pokemon [pokemon]="pokemon"></app-pokemon>
    </div>
  </div>
  `,
  styleUrls: ['./team.component.scss']
})
export class TeamComponent 
{
  getPokemon = inject(GetPokemonService);

  pokemons?: Promise<Pokemon[]>;
  posts: any;
  paste: string;

  constructor()
  {
    this.paste = 
    `Pickle (Mamoswine) (F) @ Never-Melt Ice
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
    
    monito (Ambipom) (F) @ Soul Dew  
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
    - Sunny Day`

    let data = parsePaste(this.paste);
    this.buildTeam(data);
  }

  buildTeam(paste: PokePasteData)
  {
    this.pokemons = this.getPokemon.buildPokemon(paste);
  }
}
