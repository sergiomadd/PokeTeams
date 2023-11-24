import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonComponent } from '../pokemon/pokemon.component';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent 
{
  @Input() pokemons!: Promise<Pokemon[]>;
  @Input() editorOptions!: EditorOptions;

  @ViewChildren(PokemonComponent) pokemonComponents!:QueryList<PokemonComponent>;

  options: boolean[] = [false, false, false]

  forceChange(options: EditorOptions)
  {
    this.editorOptions = structuredClone(options);
  }

  clickOptions(index: number)
  {
    switch(index)
    {
      case 0:
        this.pokemonComponents.forEach(pokemon => 
        {
          pokemon.metaDown[0] = !this.options[index];
        });
      break;
      case 1:
        this.pokemonComponents.forEach(pokemon => 
          {
            pokemon.metaDown[1] = !this.options[index];
          });
        break;
      case 2:
        
        break;
    }
    
    if(this.options[index])
    {
      this.options[index] = false;
    }
    else
    {
      for(var i = 0; i < this.options.length; i++) 
      {
        this.options[i] = false;
        this.pokemonComponents.forEach(pokemon => 
          {
            pokemon.metaDown[i] = this.options[i];
          })
      }
      this.options[index] = true;
      this.pokemonComponents.forEach(pokemon => 
        {
          pokemon.metaDown[index] = this.options[index];
        })
    }
  }
}
