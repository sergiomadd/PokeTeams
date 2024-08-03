import { Component, inject, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Nature } from 'src/app/models/pokemon/nature.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { Stat } from 'src/app/models/pokemon/stat.model';
import { TeamOptions } from 'src/app/models/teamOptions.model';
import { LinkifierService } from 'src/app/services/linkifier.service';
import { ParserService } from 'src/app/services/parser.service';
import { UtilService } from 'src/app/services/util.service';
import { PokeColor } from 'src/app/styles/pokemonColors';

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
  encapsulation: ViewEncapsulation.None
})

export class PokemonComponent 
{
  parser = inject(ParserService);
  util = inject(UtilService);
  linkifier = inject(LinkifierService);

  @Input() pokemon!: Pokemon;
  @Input() teamOptions?: TeamOptions;

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
    this.configurePokemon();

    this.maleIconPath = "https://localhost:7134/images/sprites/gender/male.png";
    this.femaleIconPath = "https://localhost:7134/images/sprites/gender/female.png";
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['editorOptions'])
    {
      this.configurePokemon();
    }
    if(changes['pokemon'])
    {
      this.pokemon = changes['pokemon'].currentValue;
      this.configurePokemon();
    }
  }

  configurePokemon()
  {
    this.loadSprite();
    this.calculateStats();
    this.linkify();
  }  

  linkify()
  {
    if(this.pokemon?.item)
    {
      this.pokemon.item.prose = this.linkifier.linkifyProse(this.pokemon.item?.prose);
    }
    if(this.pokemon?.ability)
    {
      this.pokemon.ability.prose = this.linkifier.linkifyProse(this.pokemon.ability?.prose);
    }
    if(this.pokemon?.moves && this.pokemon.moves[0] && this.pokemon.moves[0].effect)
    {
      this.pokemon.moves[0].effect.short = this.linkifier.linkifyProse(this.pokemon.moves[0].effect.short);
      this.pokemon.moves[0].effect.long = this.linkifier.linkifyProse(this.pokemon.moves[0].effect.long);
    }
    if(this.pokemon?.moves && this.pokemon.moves[1] && this.pokemon.moves[1].effect)
    {
      this.pokemon.moves[1].effect.short = this.linkifier.linkifyProse(this.pokemon.moves[1].effect.short);
      this.pokemon.moves[1].effect.long = this.linkifier.linkifyProse(this.pokemon.moves[1].effect.long);
    }
    if(this.pokemon?.moves && this.pokemon.moves[2] && this.pokemon.moves[2].effect)
    {
      this.pokemon.moves[2].effect.short = this.linkifier.linkifyProse(this.pokemon.moves[2].effect.short);
      this.pokemon.moves[2].effect.long = this.linkifier.linkifyProse(this.pokemon.moves[2].effect.long);
    }
    if(this.pokemon?.moves && this.pokemon.moves[3] && this.pokemon.moves[3].effect)
    {
      this.pokemon.moves[3].effect.short = this.linkifier.linkifyProse(this.pokemon.moves[3].effect.short);
      this.pokemon.moves[3].effect.long = this.linkifier.linkifyProse(this.pokemon.moves[3].effect.long);
    }
  }

  loadSprite()
  {
    if(this.pokemon.sprite)
    {
      if(this.pokemon.gender)
      {
        this.pokemonSpritePath = this.pokemon.shiny ? this.pokemon.sprite.shinyFemale : this.pokemon.sprite.female
      }
      else
      {
        this.pokemonSpritePath = this.pokemon.shiny ? this.pokemon.sprite.shiny : this.pokemon.sprite.base
      }
    }
    else
    {
      this.pokemonSpritePath = "assets/error.png"
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

  copyPokemon()
  {
    this.util.copyToClipboard(this.parser.reverseParsePokemon(this.pokemon));
  }

  formatItemProse(value: string | undefined) : string
  {
    if(value)
    {
      let aux = value?.split(':'); 
      aux[0] = `<span class="bold">${aux[0]}</span>`
      return aux.join(':');
    }
    return '';
  }

  getMoveColor(move)
  {
    let name = move?.pokeType?.name;
    return PokeColor[name?.toLowerCase()];
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
            this.teamOptions?.showIVs ? this.pokemon.ivs ? this.pokemon.ivs[index].value : 0 : 0,
            this.teamOptions?.showEVs ? this.pokemon.evs ? this.pokemon.evs[index].value : 0 : 0, 
            this.teamOptions?.showNature ? this.pokemon.nature ? this.calculatedStats.natures[index].value : 1 : 1,
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
            this.teamOptions?.showIVs ? this.pokemon.ivs ? this.pokemon.ivs[index].value : 0 : 0,
            this.teamOptions?.showEVs ? this.pokemon.evs ? this.pokemon.evs[index].value : 0 : 0, 
            this.teamOptions?.showNature ? this.pokemon.nature ? this.calculatedStats.natures[index].value : 1 : 1,
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
    let maxValue: number = this.teamOptions && this.teamOptions?.maxLevel > 0 ? this.teamOptions?.maxLevel : 700; //the maximun stat value of any pokemons
    let maxSize: number = 20; //the maximun allowed size in vw
    return `${value / maxValue * maxSize}vw`;
  }
}