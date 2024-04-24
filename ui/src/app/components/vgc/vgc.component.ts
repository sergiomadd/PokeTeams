import { Component } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { TagColor } from 'src/app/styles/pokemonColors';

@Component({
  selector: 'app-vgc',
  templateUrl: './vgc.component.html',
  styleUrls: ['./vgc.component.scss']
})
export class VgcComponent 
{
  pokemons: Pokemon[] = [];
  tagColor?: TagColor = TagColor.orange;

  receivePokemon($event) 
  {
    this.pokemons.push($event);
    this.pokemons = [...this.pokemons];
  }

  getTagColor(name: string)
  {
    return TagColor[name];
  }
}
