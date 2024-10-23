import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Nature } from 'src/app/features/pokemon/models/nature.model';
import { Pokemon } from 'src/app/features/pokemon/models/pokemon.model';
import { Stat } from 'src/app/features/pokemon/models/stat.model';
import { TeamOptions } from 'src/app/features/team/models/teamOptions.model';
import { ProcessedString } from 'src/app/shared/models/processedString.model';
import { LinkifierService } from 'src/app/shared/services/linkifier.service';
import { ParserService } from 'src/app/shared/services/parser.service';
import { UtilService } from 'src/app/shared/services/util.service';

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
  styleUrls: ["./pokemon.component.scss"],
})

export class PokemonComponent 
{
  parser = inject(ParserService);
  util = inject(UtilService);
  linkifier = inject(LinkifierService);
  theme = inject(ThemeService);

  @Input() pokemon!: Pokemon;
  @Input() teamOptions?: TeamOptions;
  @Input() showStatsStart?: boolean = false;
  @Output() updateStats = new EventEmitter();

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
    total: []
  };
  maxStat: number = 0;

  abilityProse: ProcessedString[] = [];
  itemProse: ProcessedString[] = [];
  moveEffectsShort: ProcessedString[][] = [];
  moveEffectsLong: ProcessedString[][] = [];
  moveTargets: ProcessedString[][] = [];

  tooltipEvol: boolean[] = [false];
  tooltipTypes: boolean[] = [false, false];
  tooltipLeft: boolean[] = [false, false];
  tooltipMiddle: boolean[] = [false, false, false];
  tooltipRight: boolean[] = [false, false, false, false];
  tooltipRightType: boolean[] = [false, false, false, false];
  showStats: boolean[] = [false]
  showNotes: boolean[] = [false]
  tooltipStats: boolean[] = [false, false, false, false, false, false]

  constructor(private cdref: ChangeDetectorRef) 
  {

  }

  async ngOnChanges(changes: SimpleChanges)
  {
    if(changes['teamOptions'])
    {
      this.teamOptions = changes['teamOptions'].currentValue;
      this.loadSprite();
      this.calculateStats();
      this.calculateMaxStat();
    }
    if(changes['pokemon'])
    {
      this.pokemon = changes['pokemon'].currentValue;
      this.loadSprite();
      this.calculateStats();
      await this.linkify();
      this.calculateMaxStat();
    }
  }

  async ngOnInit()
  {
    this.maleIconPath = "https://localhost:7134/images/sprites/gender/male.png";
    this.femaleIconPath = "https://localhost:7134/images/sprites/gender/female.png";
  
    if(this.showStatsStart)
    {
      this.showStats[0] = true;
    }
  }

  calculateMaxStat()
  {
    this.maxStat = Math.max(...this.calculatedStats?.total.map(v => v.value));
    this.updateStats.emit(this.maxStat);
  }

  getStatSize(value: number)
  {
    let maxValue: number = this.teamOptions && this.teamOptions?.maxStat > 0 ? this.teamOptions?.maxStat : 700; //the maximun stat value of any pokemons
    let maxSize: number = 20; //the maximun allowed size in vw
    return `${value / maxValue * maxSize}vw`;
  }

  async linkify()
  {
    if(this.pokemon?.item)
    {
      this.abilityProse = this.linkifier.linkifyProse(this.pokemon.ability?.prose);
    }
    if(this.pokemon?.ability)
    {
      this.itemProse = this.linkifier.linkifyProse(this.pokemon.item?.prose);
    }
    if(this.pokemon?.moves && this.pokemon.moves[0] && this.pokemon.moves[0].effect)
    {
      this.moveEffectsShort[0] = this.linkifier.linkifyProse(this.pokemon.moves[0].effect.short);
      this.moveEffectsLong[0] = this.linkifier.linkifyProse(this.pokemon.moves[0].effect.long);
      this.moveTargets[0] = this.linkifier.linkifyProse(this.pokemon.moves[0].target?.description);
    }
    if(this.pokemon?.moves && this.pokemon.moves[1] && this.pokemon.moves[1].effect)
    {
      this.moveEffectsShort[1] = this.linkifier.linkifyProse(this.pokemon.moves[1].effect.short);
      this.moveEffectsLong[1] = this.linkifier.linkifyProse(this.pokemon.moves[1].effect.long);
      this.moveTargets[1] = this.linkifier.linkifyProse(this.pokemon.moves[1].target?.description);
    }
    if(this.pokemon?.moves && this.pokemon.moves[2] && this.pokemon.moves[2].effect)
    {
      this.moveEffectsShort[2] = this.linkifier.linkifyProse(this.pokemon.moves[2].effect.short);
      this.moveEffectsLong[2] = this.linkifier.linkifyProse(this.pokemon.moves[2].effect.long);
      this.moveTargets[2] = this.linkifier.linkifyProse(this.pokemon.moves[2].target?.description);
    }
    if(this.pokemon?.moves && this.pokemon.moves[3] && this.pokemon.moves[3].effect)
    {
      this.moveEffectsShort[3] = this.linkifier.linkifyProse(this.pokemon.moves[3].effect.short);
      this.moveEffectsLong[3] = this.linkifier.linkifyProse(this.pokemon.moves[3].effect.long);
      this.moveTargets[3] = this.linkifier.linkifyProse(this.pokemon.moves[3].target?.description);
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

  clickSection(index: number, type: string)
  {
    let list: boolean[] = [];
    switch(type)
    {
      case "evol":
        list = this.tooltipEvol;
      break;
      case "types":
        list = this.tooltipTypes;
      break;
      case "left":
        list = this.tooltipLeft;
      break;
      case "middle":
        list = this.tooltipMiddle;
        break;
      case "right":
        list = this.tooltipRight;
        break;
      case "rightType":
        list = this.tooltipRightType;
        break;
      case "showStats":
        list = this.showStats;
        break;
      case "showNotes":
        list = this.showNotes;
        break;
      case "stat":
        list = this.tooltipStats;
        break;
    }

    //If tooltip visible -> hide it
    if(list[index])
    {
      //Close nested tooltip if open
      if(type === "right" && this.tooltipRightType[index])
      {
        this.tooltipRightType[index] = false;
      }
      list[index] = false;
    }
    //else -> hide all other tooltips in group
    //     -> show selected tooltip
    else
    {
      for(var i = 0; i < list.length; i++) 
      {
        //Close nested tooltip if open
        if(list[i] && this.tooltipRightType[i])
        {
          this.tooltipRightType[i] = false;
        }
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
}