import { Component, Input } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { TeamOptions } from 'src/app/models/teamOptions.model';

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.scss', '../../pokemon/pokemon.component.scss']
})
export class EvolutionComponent 
{
  @Input() sourcePokemon!: Pokemon;
  @Input() pokemon!: Pokemon;
  @Input() teamOptions?: TeamOptions;

  pokemonSpritePath?: string = '';

  oldChanges = 
  {
    sprites: undefined
  }

  ngOnInit()
  {
    this.pokemon.sprite ? this.loadSprite() : this.oldChanges.sprites = this.pokemon.sprite;
  }

  ngDoCheck() 
  {
    if(this.pokemon.sprite !== this.oldChanges.sprites) 
    {
      this.loadSprite();
    }
  }

  loadSprite()
  {
    if(this.pokemon.sprite)
    {
      if(this.sourcePokemon.gender)
      {
        this.pokemonSpritePath = this.sourcePokemon.shiny ? this.pokemon.sprite.shinyFemale : this.pokemon.sprite.female
      }
      else
      {
        this.pokemonSpritePath = this.sourcePokemon.shiny ? this.pokemon.sprite.shiny : this.pokemon.sprite.base
      }
    }
    else
    {
      this.pokemonSpritePath = "assets/error.png"
    }
  }
}
