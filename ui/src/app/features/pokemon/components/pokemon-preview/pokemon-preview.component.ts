import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { PokemonPreview } from 'src/app/features/pokemon/models/pokemonPreview.model';
import { Layout } from 'src/app/features/search/models/layout.enum';

@Component({
  selector: 'app-pokemon-preview',
  templateUrl: './pokemon-preview.component.html',
  styleUrls: ['./pokemon-preview.component.scss']
})
export class PokemonPreviewComponent 
{
  theme = inject(ThemeService);
  window = inject(WindowService);

  @Input() pokemon?: PokemonPreview;
  @Input() layout?: Layout;

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
    if(this.pokemon?.moves && this.pokemon?.moves[index] 
      && this.pokemon?.moves[index].name?.content)
    {
      if(this.pokemon?.moves[index].name?.content.split(" ").length === 1
        && this.pokemon?.moves[index].name?.content.length > 5)
      {
        const rowOne = this.pokemon?.moves[index].name?.content.substring(0, 7);
        const rowTwo = this.pokemon?.moves[index].name?.content.substring(7);
        return [rowOne, rowTwo];
      }
      return this.pokemon?.moves[index].name?.content.split(" ");
    }
    return [];
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
