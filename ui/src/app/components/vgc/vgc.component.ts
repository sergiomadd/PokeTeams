import { Component } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-vgc',
  templateUrl: './vgc.component.html',
  styleUrls: ['./vgc.component.scss']
})
export class VgcComponent 
{
  pokemons!: Promise<Pokemon[]>;

  receivePokemons($event) 
  {
    console.log("received", $event)
    this.pokemons = $event
  }
}
