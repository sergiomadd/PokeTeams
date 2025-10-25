import { Component, inject, SimpleChanges, input } from '@angular/core';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { PokemonPreview } from '../../../../core/models/pokemon/pokemonPreview.model';
import { NgClass, NgStyle } from '@angular/common';
import { TooltipComponent } from '../../dumb/tooltip/tooltip.component';
import { GetMoveColorPipe } from '../../../pipes/color-pipes/getMoveColor.pipe';

@Component({
    selector: 'app-pokemon-preview',
    templateUrl: './pokemon-preview.component.html',
    styleUrls: ['./pokemon-preview.component.scss'],
    imports: [NgClass, NgStyle, TooltipComponent, GetMoveColorPipe]
})
export class PokemonPreviewComponent 
{
  theme = inject(ThemeService);
  window = inject(WindowService);

  readonly pokemon = input<PokemonPreview>();

  expanded: boolean = false;
  pokemonSpritePath: string | undefined = undefined;
  movesOpen: boolean[] = [false, false, false, false];

  ngOnInit()
  {
    this.getSprite();
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes["pokemon"])
    {
      this.getSprite();
    }
  }

  getMoveNameRows(index: number)
  {
    const pokemon = this.pokemon();
    if(pokemon?.moves && pokemon?.moves[index] 
      && pokemon?.moves[index].name?.content)
    {
      if(pokemon?.moves[index].name?.content.split(" ").length === 1)
      {
        const rowOne = pokemon?.moves[index].name?.content.substring(0, 7);
        const rowTwo = pokemon?.moves[index].name?.content.substring(7);
        if(index > 1 && pokemon?.moves[index].name?.content.length <= 7)
        {
          return [rowTwo, rowOne];
        }
        return [rowOne, rowTwo];
      }
      return pokemon?.moves[index].name?.content.split(" ");
    }
    return [];
  }

  expand()
  {
    this.expanded = !this.expanded;
  }

  getSprite()
  {
      const pokemon = this.pokemon();
      if(pokemon?.gender === "female")
      {
        this.pokemonSpritePath = pokemon?.shiny ? pokemon?.sprite?.shinyFemale : pokemon?.sprite?.female
      }
      else
      {
        this.pokemonSpritePath = pokemon?.shiny ? pokemon?.sprite?.shiny : pokemon?.sprite?.base
      }
  }
}
