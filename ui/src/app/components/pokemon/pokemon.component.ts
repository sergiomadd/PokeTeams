import { Component, Input, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Move } from 'src/app/models/move.model';
import { Nature } from 'src/app/models/nature.model';
import { Pokemon } from 'src/app/models/pokemon.model';
import { Sprite } from 'src/app/models/sprite.model';
import { Stat } from 'src/app/models/stat.model';
import { LinkifierService } from 'src/app/services/linkifier.service';
import { Colors } from 'src/app/styles/pokemonColors';

interface CalculatedStats
{
  base: Stat[],
  ivs: Stat[],
  evs: Stat[],
  natures: Stat[],
  total: Stat[]
} 

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
  encapsulation: ViewEncapsulation.None,
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

  calculatedStats: CalculatedStats = 
  {
    base: [],
    ivs: [],
    evs: [],
    natures: [],
    total: [],
  };

  metaLeft: boolean[] = [false, false];
  metaMiddle: boolean[] = [false, false, false, false, false, false, false];
  metaRight: boolean[] = [false, false, false, false];
  metaDown: boolean[] = [false, false, false]
  showStats: boolean[] = [false]
  showNotes: boolean[] = [false]
  metaStats: boolean[] = [false, false, false, false, false, false]

  constructor() 
  {

  }

  ngOnInit()
  {
    this.loadSprite()
    this.calculateStats()

    this.maleIconPath = "https://localhost:7134/images/sprites/gender/male.png";
    this.femaleIconPath = "https://localhost:7134/images/sprites/gender/female.png";
  }

  loadSprite()
  {
    if(this.pokemon.sprites)
    {
      let choosenVariationPath = this.pokemon.sprites[this.editorOptions.pokemonSpritesGen!.identifier];
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
      case "showStats":
        list = this.showStats;
        break;
      case "showNotes":
        list = this.showNotes;
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
  calculateStats()
  {
    if(this.pokemon.stats)
    {
      this.pokemon.stats.forEach((stat, index) => 
      {
        this.calculatedStats.base[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateBaseStat(stat)
        }
        this.calculatedStats.ivs[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateIV(this.pokemon.ivs ? this.pokemon.ivs[index].value : 0)
        }
        this.calculatedStats.evs[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateEV(this.pokemon.evs ? this.pokemon.evs[index].value : 0)
        }
        this.calculatedStats.natures[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.getNatureValue(stat, this.pokemon.nature)
        }
        this.calculatedStats.total[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateStat(
            stat.value, 
            this.pokemon.level ? this.pokemon.level : 50,
            this.editorOptions.showIVs ? this.pokemon.ivs ? this.pokemon.ivs[index].value : 0 : 0,
            this.editorOptions.showEVs ? this.pokemon.evs ? this.pokemon.evs[index].value : 0 : 0, 
            this.editorOptions.showNature ? this.pokemon.nature ? this.calculatedStats.natures[index].value : 1 : 1,
            stat.identifier === "hp" ? true : false)
        }
      });
    }
    /* TODO: handle no stats (wrong poke name) case
    else
    {
      for(let i=0; i<6; i++) 
      {
        let stat: Stat = 
        {
          identifier: 'error',
          name: 'error',
          value: 0
        }
        this.calculatedStats[i] = stat;
      }
    }
    */
  }

  calculateTotals()
  {
    if(this.pokemon.stats)
    {
      this.pokemon.stats.forEach((stat, index) => 
      {
        this.calculatedStats.total[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateStat(
            stat.value, 
            this.pokemon.level ? this.pokemon.level : 50,
            this.editorOptions.showIVs ? this.pokemon.ivs ? this.pokemon.ivs[index].value : 0 : 0,
            this.editorOptions.showEVs ? this.pokemon.evs ? this.pokemon.evs[index].value : 0 : 0, 
            this.editorOptions.showNature ? this.pokemon.nature ? this.calculatedStats.natures[index].value : 1 : 1,
            stat.identifier === "hp" ? true : false)
        }
      });
    }
  }
  
  calculateStat(base: number, level: number, iv: number, ev: number, nature: number, hp: boolean) : number
  {
    let total: number;
    //HP: ((2 * base + iv + (ev/4)) * level) / 100) + level + 10
    if(hp)
    {
      total = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10;
    }
    //Rest: ((((2 * base + iv + (ev/4)) * level) / 100) + 5) * nature
    else
    {
      total = Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * nature);
    }
    return total;
  }

  calculateBaseStat(baseStat: Stat) : number
  {
    return this.calculateStat(baseStat.value, this.pokemon.level ? this.pokemon.level : 50, 0, 0, 1, baseStat.identifier === "hp" ? true : false);
  }

  calculateIV(iv: number) : number
  {
    return Math.round((iv * (this.pokemon.level ? this.pokemon.level : 50)) / 100);
  }

  calculateEV(ev: number) : number
  {
    return Math.round((Math.floor(ev / 4) * (this.pokemon.level ? this.pokemon.level : 50)) / 100);
  }

  getNatureValue(baseStat?: Stat, nature?: Nature) : number
  {
    let natureValue: number;
    if(baseStat)
    {
      if(nature ? nature.increasedStat.identifier === baseStat.identifier && nature.decreasedStat.identifier === baseStat.identifier : false)
      {
        natureValue = 1;
      }
      else if(nature ? nature.increasedStat.identifier === baseStat.identifier : false)
      {
        natureValue = 1.1;
      }
      else if(nature ? nature.decreasedStat.identifier === baseStat.identifier : false)
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
    let maxValue: number = this.editorOptions.maxLevel; //the maximun stat value of all pokemons
    let maxSize: number = 20; //the maximun size in vw
    return `${value / maxValue * maxSize}vw`;
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