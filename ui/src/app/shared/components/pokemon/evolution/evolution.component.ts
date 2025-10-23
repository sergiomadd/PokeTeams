import { Component, SimpleChanges, input, model } from '@angular/core';
import { Evolution } from '../../../../core/models/pokemon/evolution.model';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { PokemonForm } from '../../../../core/models/pokemon/pokemonForm.model';
import { TeamOptions } from '../../../../core/models/team/teamOptions.model';

@Component({
    selector: 'app-evolution',
    templateUrl: './evolution.component.html',
    styleUrls: ['../pokemon-card/pokemon-card.component.scss'],
    standalone: false
})
export class EvolutionComponent 
{
  readonly sourcePokemon = model<Pokemon | undefined>();
  readonly pokemon = model<Evolution>();
  readonly form = input<PokemonForm>();
  readonly teamOptions = input<TeamOptions>();

  pokemonSpritePath?: string = '';

  ngOnInit()
  {
    if(!this.pokemon())
    {
      this.pokemon.set(this.sourcePokemon());
    }
    const form = this.form();
    if(form)
    {
      this.pokemon.set( 
      {
        name: form.name,
        dexNumber: form.dexNumber,
        pokemonId: form.pokemonId,
        types: form.types,
        sprite: form.sprite,
        evolutions: []
      });
    }
    this.loadEvolutionSprite();
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['sourcePokemon'])
    {
      this.sourcePokemon.set({...changes['sourcePokemon'].currentValue});
      this.pokemon.set({...this.sourcePokemon(), evolutions: this.sourcePokemon()?.evolutions ?? []});
      this.loadEvolutionSprite();
    }

    if(changes['pokemon'])
    {
      this.pokemon.set({...changes['pokemon'].currentValue});
      this.loadEvolutionSprite();
    }
  }

  loadEvolutionSprite()
  {
    const pokemon = this.pokemon();
    if(pokemon?.sprite)
    {
      const sourcePokemon = this.sourcePokemon();
      if(sourcePokemon?.gender && pokemon.sprite.female)
      {
        this.pokemonSpritePath = sourcePokemon?.shiny ? pokemon.sprite.shinyFemale : pokemon.sprite.female
      }
      else
      {
        this.pokemonSpritePath = sourcePokemon?.shiny ? pokemon.sprite.shiny : pokemon.sprite.base
      }
    }
    else
    {
      this.pokemonSpritePath = "assets/error.png"
    }
  }
}
