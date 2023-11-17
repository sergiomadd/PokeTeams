import { Component, Input } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Move } from 'src/app/models/move.model';
import { Pokemon } from 'src/app/models/pokemon.model';
import { Colors } from 'src/app/styles/pokemonColors';
@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})

export class PokemonComponent 
{
  @Input() pokemon!: Pokemon;
  @Input() editorOptions!: EditorOptions;

  pokemonSpritePath?: string = '';
  spriteCategory: number = 0;
  maleIconPath: string = '';
  femaleIconPath: string = '';

  metaLeft: boolean[] = [false, false, false, false];
  metaMiddle: boolean[] = [false, false, false, false, false, false];
  metaRight: boolean[] = [false, false, false, false];
  

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
    
    this.maleIconPath = "https://localhost:7134/images/sprites/gender/male.png";
    this.femaleIconPath = "https://localhost:7134/images/sprites/gender/female.png";
  }

  clickMeta(index: number, type: string)
  {
    let list: boolean[] = [];
    switch(type)
    {
      case "left":
        list = this.metaLeft;
      break;
      case "middle":
        list = this.metaMiddle;
        break;
      case "right":
        list = this.metaRight;
        break;
    }
    if(list[index])
    {
      list[index] = false;
    }
    else
    {
      for(var i = 0; i < list.length; i++) {
        list[i] = false;
      }
      list[index] = true;
    }
  }

  getMoveColor(move)
  {
    let name = move.pokeType?.name;
    return Colors[name?.toLowerCase()];
  }
}