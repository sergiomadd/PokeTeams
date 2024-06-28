import { Component, Input } from '@angular/core';
import { PokemonPreview } from 'src/app/models/pokemonPreview.model';

@Component({
  selector: 'app-pokemon-preview',
  templateUrl: './pokemon-preview.component.html',
  styleUrls: ['./pokemon-preview.component.scss']
})
export class PokemonPreviewComponent 
{
  @Input() pokemon?: PokemonPreview;

  expanded: boolean = false;
  pokemonSpritePath: string | undefined = undefined;

  ngOnInit()
  {
    this.getSprite();
  }

  expand()
  {
    this.expanded = !this.expanded;
  }

  getSprite()
  {
      if(this.pokemon?.gender === "female")
      {
        this.pokemonSpritePath = this.pokemon?.shiny ? this.pokemon?.sprite?.shinyFemale : this.pokemon?.sprite?.female
      }
      else
      {
        this.pokemonSpritePath = this.pokemon?.shiny ? this.pokemon?.sprite?.shiny : this.pokemon?.sprite?.base
      }
  }
}
