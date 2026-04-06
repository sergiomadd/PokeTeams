import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Evolution } from '../../../../core/models/pokemon/evolution.model';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { PokemonForm } from '../../../../core/models/pokemon/pokemonForm.model';

@Component({
    selector: 'app-evolution',
    templateUrl: './evolution.component.html',
    styleUrls: ['../pokemon-card/pokemon-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvolutionComponent 
{
  readonly sourcePokemon = input<Pokemon | undefined>();
  readonly pokemon = input<Evolution>();
  readonly form = input<PokemonForm>();

  readonly actualPokemon = computed(() =>
  {
    const form = this.form();
    if (form) 
    {
      return {
        name: form.name,
        dexNumber: form.dexNumber,
        pokemonId: form.pokemonId,
        types: form.types,
        sprite: form.sprite,
        evolutions: []
      };
    }
    return this.pokemon() ?? this.sourcePokemon();
  })

  readonly pokemonSpritePath = computed(() => 
  {
    const actualPokemon = this.actualPokemon();
    const sourcePokemon = this.sourcePokemon();

    if (!actualPokemon?.sprite) 
    {
      return "assets/error.png";
    }
    
    if (sourcePokemon?.gender && actualPokemon.sprite.female) 
    {
      return sourcePokemon?.shiny ? actualPokemon.sprite.shinyFemale : actualPokemon.sprite.female;
    }
    return sourcePokemon?.shiny ? actualPokemon.sprite.shiny : actualPokemon.sprite.base;
  });
}
