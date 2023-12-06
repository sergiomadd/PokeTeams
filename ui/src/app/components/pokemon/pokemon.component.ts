import { Component, Input, SimpleChanges } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Move } from 'src/app/models/move.model';
import { Nature } from 'src/app/models/nature.model';
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

  test: string = "test"

  pokemonSpritePath?: string = '';
  spriteCategory: number = 0;
  maleIconPath: string = '';
  femaleIconPath: string = '';
  oldChanges = 
  {
    sprites: undefined,
    stats: undefined,
    ivs: undefined,
    evs: undefined
  }

  calculatedStats: Stat[] = [];

  metaLeft: boolean[] = [false, false];
  metaMiddle: boolean[] = [false, false, false, false, false, false, false];
  metaRight: boolean[] = [false, false, false, false];
  metaDown: boolean[] = [false, false, false]
  options: boolean[] = [false, false, false]
  metaStats: boolean[] = [false, false, false, false, false, false]

  constructor() 
  {

  }

  ngOnInit()
  {
    this.calculateStats();
    this.pokemon.sprites ? this.loadSprite() : this.oldChanges.sprites = this.pokemon.sprites;
    this.pokemon.stats ? this.calculateStats() : this.oldChanges.stats = this.pokemon.stats;
    this.pokemon.ivs ? this.calculateStats() : this.oldChanges.ivs = this.pokemon.ivs;
    this.pokemon.evs ? this.calculateStats() : this.oldChanges.evs = this.pokemon.evs;

    this.maleIconPath = "https://localhost:7134/images/sprites/gender/male.png";
    this.femaleIconPath = "https://localhost:7134/images/sprites/gender/female.png";
  }
  
  //Have to use custom change detetor for array items that are used onInit
  ngDoCheck() 
  {
    if(this.pokemon.sprites !== this.oldChanges.sprites) 
    {
      this.loadSprite();
    }

    if(this.pokemon.stats  !== this.oldChanges.stats
      || this.pokemon.ivs  !== this.oldChanges.ivs
      || this.pokemon.evs  !== this.oldChanges.evs)
    {
      this.calculateStats();
    }
  }

  loadSprite()
  {
    if(this.pokemon.sprites)
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
  }

  calculateStats()
  {
    if(this.pokemon.stats)
    {
      this.pokemon.stats.forEach((stat, index) => 
      {
        this.calculatedStats[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateStat(stat, this.pokemon.ivs ? this.pokemon.ivs[index] : undefined,
            this.pokemon.evs ? this.pokemon.evs[index] : undefined, this.pokemon.nature ? this.pokemon.nature : undefined)
        }
      });
    }
    else
    {
      for(let i=0; i<6; i++) 
      {
        let stat: Stat = 
        {
          identifier: 'error',
          name: 'error',
          value: this.calculateStat(undefined, this.pokemon.ivs ? this.pokemon.ivs[i] : undefined,
            this.pokemon.evs ? this.pokemon.evs[i] : undefined, this.pokemon.nature ? this.pokemon.nature : undefined)
        }
        this.calculatedStats[i] = stat;
      }
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
      case "down":
        list = this.metaDown;
        break;
      case "options":
        list = this.options;
        break;
      case "stat":
        list = this.metaStats;
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
  calculateStat(baseStat?: Stat, ivs?: Stat, evs?: Stat, nature?: Nature) : number
  {
    let total: number;
    let natureValue: number = this.getNatureValue(baseStat, nature);
    //HP: (((2 * base + iv + (ev/4)) * level) / 100) + level + 10
    if(baseStat ? baseStat.identifier === "hp" : false)
    {
      total = Math.floor((((2 * (baseStat ? baseStat.value : 0) + (ivs ? ivs.value : 0) + 
      (evs ? Math.floor(evs.value / 4) : 0)) * (this.pokemon.level ? this.pokemon.level : 100))
       / 100) + (this.pokemon.level ? this.pokemon.level : 100) + 10);
    }
    //Rest: ((((2 * base + iv + (ev/4)) * level) / 100) + 5) * nature
    else
    {(
      total = Math.floor((Math.floor(((2 * (baseStat ? baseStat.value : 0) + (ivs ? ivs.value : 0)
       + (evs ? Math.floor(evs.value / 4) : 0)) * (this.pokemon.level ? this.pokemon.level : 100))
      / 100) + 5) * natureValue));
    }
    return total;
  }

  calculateBaseStat(baseStat: Stat) : number
  {
    return this.calculateStat(baseStat, undefined, undefined, undefined);
  } 

  calculateEVValue(stat: Stat) : number
  {
    return Math.floor(stat.value / 4);
  } 
  
  getNatureValue(baseStat?: Stat, nature?: Nature) : number
  {
    let natureValue: number;
    if(baseStat)
    {
      if(nature ? nature.increasedStat === baseStat.name && nature.decreasedStat === baseStat.name : false)
      {
        natureValue = 1;
      }
      else if(nature ? nature.increasedStat === baseStat.name : false)
      {
        natureValue = 1.1;
      }
      else if(nature ? nature.decreasedStat === baseStat.name : false)
      {
        natureValue = 0.9;
      }
      else
      {
        natureValue = 1;
      }
    }
    else
    {
      natureValue = 1;
    }
    return natureValue;
  }

  getStatSize(value: number)
  {
    return `${value / 252 * 100 * 2}px`;
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