import { Component } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';

@Component({
  selector: 'app-vgc',
  templateUrl: './vgc.component.html',
  styleUrls: ['./vgc.component.scss']
})
export class VgcComponent 
{
  pokemons: Pokemon[] = [];

  receivePokemon($event) 
  {
    this.pokemons.push($event);
    this.pokemons = [...this.pokemons];
  }
}
