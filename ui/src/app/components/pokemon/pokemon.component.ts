import { Component, Input } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon';

@Component({
  selector: 'app-pokemon',
  template: `
  <div>
    Pokemon: {{pokemon.name}}
  </div>
  `
  ,
  styleUrls: ['./pokemon.component.scss']
})


export class PokemonComponent 
{

  @Input() pokemon!: Pokemon;

  constructor() 
  {

  }


}
