import { Pipe, PipeTransform } from "@angular/core";
import { Pokemon } from "../../../core/models/pokemon/pokemon.model";

@Pipe({
    name: 'getPokemonSpritePathPipe',
    pure: true
})

//Rename to calculate effectiveness
export class GetPokemonSpritePathPipe implements PipeTransform
{
  transform(pokemon: Pokemon | null | undefined): string | undefined
  {
    let pokemonSpritePath: string | undefined = "assets/img/error.png";
    if(pokemon?.sprite)
    {
      if(pokemon.gender && pokemon.sprite.female)
      {
        pokemonSpritePath = pokemon.shiny ? pokemon.sprite.shinyFemale : pokemon.sprite.female
      }
      else
      {
        pokemonSpritePath = pokemon.shiny ? pokemon.sprite.shiny : pokemon.sprite.base
      }
    }
    return pokemonSpritePath;
  }
}