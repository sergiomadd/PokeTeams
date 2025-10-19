import { Component, Input } from '@angular/core';
import { PokemonPreview } from '../../../../core/models/pokemon/pokemonPreview.model';

@Component({
    selector: 'app-pokemon-icons',
    templateUrl: './pokemon-icons.component.html',
    styleUrl: './pokemon-icons.component.scss',
    standalone: false
})
export class PokemonIconsComponent 
{
  @Input() pokemons: PokemonPreview[] = [];


  
}
