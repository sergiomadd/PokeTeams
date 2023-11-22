import { Component, Input, SimpleChanges } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Move } from 'src/app/models/move.model';
import { Pokemon } from 'src/app/models/pokemon.model';
import { Stat } from 'src/app/models/stat.model';
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
    let choosenVariationPath = this.pokemon.sprites[parseInt(this.editorOptions.pokemonSpritesGen.identifier)];

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

  ngOnChanges(changes: SimpleChanges)
  {
    let choosenVariationPath = this.pokemon.sprites[this.editorOptions.pokemonSpritesGen.identifier];

    if(this.pokemon.gender === "female")
    {
      this.pokemonSpritePath = this.pokemon.shiny ? choosenVariationPath.shinyFemale : choosenVariationPath.female
    }
    else
    {
      this.pokemonSpritePath = this.pokemon.shiny ? choosenVariationPath.shiny : choosenVariationPath.base
    }
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

  //stats

  calculateTotal(baseStat: Stat, ivs?: Stat, evs?: Stat)
  {
    let total: number = baseStat.value
    if(ivs && this.editorOptions.showIVs)
    {
      total += ivs?.value;
    }
    if(evs && this.editorOptions.showEVs)
    {
      total += Math.round(evs?.value / 4);
    }

    return total
  }

  getStatHeight(stat: Stat, type: string)
  {
    if(type === "evs")
    {
      return `${stat.value / 252 / 4 * 100 * 4}px`;
    }
    return `${stat.value / 252 * 100 * 4}px`;
  }
  
  getStatName(stat: Stat)
  {
    const nameDict = 
    {
      "hp": "HP",
      "attack": "Atk",
      "defense": "Def",
      "special-attack": "SpA", //cant put speacial-attack
      "special-defense": "SpD",
      "speed": "Spe"
    }
    return nameDict[stat.identifier];
  }

  getStatColor(stat: Stat)
  {
    const statColors = 
    {
      "hp": "#FF0000",
      "attack": "#F08030",
      "defense": "#F8D030",
      "special-attack": "#6890F0",
      "special-defense": "#78C850",
      "speed": "#F85888"
    };
    return statColors[stat.identifier];
  }
  
}