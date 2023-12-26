import { Component, Input } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.scss', '../../pokemon/pokemon.component.scss']
})
export class EvolutionComponent 
{
  @Input() sourcePokemon!: Pokemon;
  @Input() pokemon!: Pokemon;
  @Input() editorOptions?: EditorOptions;

  pokemonSpritePath?: string = '';

  oldChanges = 
  {
    sprites: undefined
  }

  ngOnInit()
  {
    this.pokemon.sprites ? this.loadSprite() : this.oldChanges.sprites = this.pokemon.sprites;
  }

  ngDoCheck() 
  {
    if(this.pokemon.sprites !== this.oldChanges.sprites) 
    {
      this.loadSprite();
    }
  }

  loadSprite()
  {
    if(this.pokemon.sprites)
    {
      let choosenVariationPath = this.pokemon.sprites[this.editorOptions!.pokemonSpritesGen.identifier];
      if(this.sourcePokemon.gender === "female")
      {
        this.pokemonSpritePath = this.sourcePokemon.shiny ? choosenVariationPath.shinyFemale : choosenVariationPath.female
      }
      else
      {
        this.pokemonSpritePath = this.sourcePokemon.shiny ? choosenVariationPath.shiny : choosenVariationPath.base
      }
    }
  }
}
