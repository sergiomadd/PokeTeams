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
  @Input() pokemons!: Pokemon[];
  @Input() editorOptions!: EditorOptions;

  @ViewChildren(PokemonComponent) pokemonComponents!:QueryList<PokemonComponent>;

  showAllStats: boolean = false;
  showAllNotes: boolean = false;

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
          pokemon.showStats[0] = !this.showAllStats;
        });
        this.showAllStats = !this.showAllStats;
      break;
      case 1:
        this.pokemonComponents.forEach(pokemon => 
          {
            pokemon.showNotes[0] = !this.showAllNotes;
          });
          this.showAllNotes = !this.showAllNotes;
        break;
      case 2:
        
        break;
    }
  }
}
