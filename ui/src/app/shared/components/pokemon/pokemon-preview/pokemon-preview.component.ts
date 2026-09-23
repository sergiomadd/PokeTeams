import { NgClass, NgStyle } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { PokemonPreview } from '../../../../core/models/pokemon/pokemonPreview.model';
import { GetMoveColorPipe } from '../../../pipes/color-pipes/getMoveColor.pipe';
import { TooltipComponent } from '../../dumb/tooltip/tooltip.component';

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

  expanded = signal<boolean>(false);
  pokemonSpritePath = signal<string | undefined>(undefined);
  movesOpen = signal<boolean[]>([false, false, false, false]);

  constructor()
  {
    this.getSprite();

    effect(() => 
    {
      this.pokemon();
      this.getSprite();
    })
  }

  getMoveNameRows(index: number)
  {
    const pokemon = this.pokemon();
    if(pokemon?.moves && pokemon?.moves[index] && pokemon?.moves[index].name?.content)
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
    this.expanded.update(value => !value)
  }

  getSprite()
  {
    const pokemon = this.pokemon();
    if(pokemon?.gender === "female")
    {
      this.pokemonSpritePath.set(pokemon?.shiny ? pokemon?.sprite?.shinyFemale : pokemon?.sprite?.female);
    }
    else
    {
      this.pokemonSpritePath.set(pokemon?.shiny ? pokemon?.sprite?.shiny : pokemon?.sprite?.base);
    }
  }
}
