import { Component, Input, SimpleChanges } from '@angular/core';
import { Evolution } from 'src/app/core/models/pokemon/evolution.model';
import { Pokemon } from 'src/app/core/models/pokemon/pokemon.model';
import { TeamOptions } from 'src/app/core/models/team/teamOptions.model';

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['../pokemon/pokemon.component.scss']
})
export class EvolutionComponent 
{
  @Input() sourcePokemon!: Pokemon;
  @Input() pokemon!: Evolution;
  @Input() teamOptions?: TeamOptions;

  pokemonSpritePath?: string = '';

  ngOnInit()
  {
    this.loadSprite();
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['sourcePokemon'])
    {
      this.sourcePokemon = changes['sourcePokemon'].currentValue;
      this.loadSprite();
    }

    if(changes['pokemon'])
    {
      this.pokemon = changes['pokemon'].currentValue;
      this.loadSprite();
    }
    
  }

  loadSprite()
  {
    if(this.pokemon.sprite)
    {
      if(this.sourcePokemon.gender && this.pokemon.sprite.female)
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
