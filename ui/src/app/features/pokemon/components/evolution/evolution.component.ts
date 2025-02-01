import { Component, Input, SimpleChanges } from '@angular/core';
import { Pokemon } from 'src/app/features/pokemon/models/pokemon.model';
import { TeamOptions } from 'src/app/features/team/models/teamOptions.model';
import { Evolution } from '../../models/evolution.model';

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
