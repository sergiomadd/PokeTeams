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
  itemSpritePath: string = '';
  pokemonSpritePath?: string = '';
  pokemonChoosenSpriteCategory: any = '';

  constructor() 
  {
    this.pokemonChoosenSpriteCategory = spriteCategories.base;
  }

  ngOnInit()
  {
    type StatusKey1 = keyof typeof this.pokemon.sprites;
    let category: StatusKey1 = this.pokemonChoosenSpriteCategory;


    let choosenVariationPath = this.pokemon.sprites[category];

    if(this.pokemon.gender === "female")
    {
      this.pokemonSpritePath = this.pokemon.shiny ? choosenVariationPath.shinyFemale : choosenVariationPath.female
    }
    else
    {
      this.pokemonSpritePath = this.pokemon.shiny ? choosenVariationPath.shiny : choosenVariationPath.base
    }
    


    this.itemSpritePath = 'https://localhost:7134/images/sprites/items/' + this.pokemon.item?.identifier + '.png';
  }
}

enum spriteCategories 
{
  base = "base",
  redBlue = "redBlue",
  yellow = "yellow",
  gold = "gold",
  silver = "silver",
  crystal = "crystal",
  rubySapphire = "rubySapphire",
  fireredLeafgreen = "fireredLeafgreen",
  emerald = "emerald",
  diamondPearl = "diamondPearl",
  heartgoldSoulsilver = "heartgoldSoulsilver",
  platinum = "platinum",
  blackWhite = "blackWhite",
  blackWhiteAnimated = "blackWhiteAnimated",
  xy = "xy",
  omegarubyAlphasapphire = "omegarubyAlphasapphire",
  ultraSunUltraMoon = "ultraSunUltraMoon",
  swordShield = "swordShield",
  showdown = "showdown",
  home = "home",
  officialArtwork = "officialArtwork"
}