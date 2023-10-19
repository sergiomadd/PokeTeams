import { Component, Input } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html'
  ,
  styleUrls: ['./pokemon.component.scss']
})

export class PokemonComponent 
{
  @Input() pokemon!: Pokemon;
  pokemonSpritePath?: string = '';
  spriteCategory: number = 0;
  shinyIconPath: string = '';
  maleIconPath: string = '';
  femaleIconPath: string = '';

  constructor() 
  {

  }

  ngOnInit()
  {
    let choosenVariationPath = this.pokemon.sprites[this.spriteCategory];

    if(this.pokemon.gender === "female")
    {
      this.pokemonSpritePath = this.pokemon.shiny ? choosenVariationPath.shinyFemale : choosenVariationPath.female
    }
    else
    {
      this.pokemonSpritePath = this.pokemon.shiny ? choosenVariationPath.shiny : choosenVariationPath.base
    }
    
    this.shinyIconPath = "https://localhost:7134/images/sprites/shiny/gen-vii_pokedex.png";
    this.maleIconPath = "https://localhost:7134/images/sprites/gender/male.png";
    this.femaleIconPath = "https://localhost:7134/images/sprites/gender/female.png";

  }
}