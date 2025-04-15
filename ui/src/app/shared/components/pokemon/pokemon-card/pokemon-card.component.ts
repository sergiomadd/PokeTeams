import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LinkifierService } from 'src/app/core/helpers/linkifier.service';
import { ParserService } from 'src/app/core/helpers/parser.service';
import { ThemeService } from 'src/app/core/helpers/theme.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { FeedbackColors, GenderColors, NatureColors, shinyColor } from 'src/app/core/models/misc/colors';
import { ProcessedString } from 'src/app/core/models/misc/processedString.model';
import { Nature } from 'src/app/core/models/pokemon/nature.model';
import { Pokemon } from 'src/app/core/models/pokemon/pokemon.model';
import { Stat } from 'src/app/core/models/pokemon/stat.model';
import { TeamOptions } from 'src/app/core/models/team/teamOptions.model';
import { selectLang } from 'src/app/core/store/config/config.selectors';


interface CalculatedStats
{
  base: Stat[],
  ivs: Stat[],
  evs: Stat[],
  natures: Stat[],
  total: Stat[]
} 

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss'
})
export class PokemonCardComponent 
{
  parser = inject(ParserService);
  util = inject(UtilService);
  linkifier = inject(LinkifierService);
  theme = inject(ThemeService);
  store = inject(Store);
  window = inject(WindowService);

  @Input() pokemon?: Pokemon | null;
  @Input() teamOptions?: TeamOptions;
  @Input() showStatsStart?: boolean = false;
  @Input() editorPreview?: boolean = false;
  @Output() triggerNotesEvent = new EventEmitter<boolean>()
  @Output() updateStats = new EventEmitter();
  @Output() triggerTooltip = new EventEmitter();

  selectedLang$: Observable<string> = this.store.select(selectLang);
  selectedLang?: string;

  pokemonSpritePath?: string = '';
  spriteCategory: number = 0;
  copied?: boolean;
  readonly genderColors = GenderColors;
  readonly natureColors = NatureColors;
  readonly shinyColor = shinyColor;
  readonly feedbackColors = FeedbackColors;

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
  tooltipMiddle: boolean[] = [false];
  tooltipRight: boolean[] = [false, false, false, false];
  tooltipRightType: boolean[] = [false, false, false, false];
  tooltipRightClass: boolean[] = [false, false, false, false];
  showStats: boolean[] = [false]
  showNotes: boolean[] = [false]
  tooltipStats: boolean[] = [false, false, false, false, false, false]

  constructor() 
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
    if(this.showStatsStart)
    {
      this.showStats[0] = true;
    }
  }

  async linkify()
  {
    if(this.pokemon?.ability)
    {
      this.abilityProse = this.linkifier.linkifyProse(this.pokemon.ability?.prose.content);
    }
    if(this.pokemon?.item)
    {
      this.itemProse = this.linkifier.linkifyProse(this.pokemon.item?.prose.content);
    }
    if(this.pokemon?.moves && this.pokemon.moves[0] && this.pokemon.moves[0].effect)
    {
      this.moveEffectsShort[0] = this.linkifier.linkifyProse(this.pokemon.moves[0].effect.short.content);
      this.moveEffectsLong[0] = this.linkifier.linkifyProse(this.pokemon.moves[0].effect.long.content);
      this.moveTargets[0] = this.linkifier.linkifyProse(this.pokemon.moves[0].target?.description.content);
    }
    if(this.pokemon?.moves && this.pokemon.moves[1] && this.pokemon.moves[1].effect)
    {
      this.moveEffectsShort[1] = this.linkifier.linkifyProse(this.pokemon.moves[1].effect.short.content);
      this.moveEffectsLong[1] = this.linkifier.linkifyProse(this.pokemon.moves[1].effect.long.content);
      this.moveTargets[1] = this.linkifier.linkifyProse(this.pokemon.moves[1].target?.description.content);
    }
    if(this.pokemon?.moves && this.pokemon.moves[2] && this.pokemon.moves[2].effect)
    {
      this.moveEffectsShort[2] = this.linkifier.linkifyProse(this.pokemon.moves[2].effect.short.content);
      this.moveEffectsLong[2] = this.linkifier.linkifyProse(this.pokemon.moves[2].effect.long.content);
      this.moveTargets[2] = this.linkifier.linkifyProse(this.pokemon.moves[2].target?.description.content);
    }
    if(this.pokemon?.moves && this.pokemon.moves[3] && this.pokemon.moves[3].effect)
    {
      this.moveEffectsShort[3] = this.linkifier.linkifyProse(this.pokemon.moves[3].effect.short.content);
      this.moveEffectsLong[3] = this.linkifier.linkifyProse(this.pokemon.moves[3].effect.long.content);
      this.moveTargets[3] = this.linkifier.linkifyProse(this.pokemon.moves[3].target?.description.content);
    }
  }

  loadSprite()
  {
    if(this.pokemon?.sprite)
    {
      if(this.pokemon.gender && this.pokemon.sprite.female)
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
      this.pokemonSpritePath = "assets/img/error.png"
    }
  }

  //For tooltip
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
      case "rightClass":
        list = this.tooltipRightClass;
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
      if(type === "right" && this.tooltipRightClass[index])
      {
        this.tooltipRightClass[index] = false;
      }
      list[index] = false;
    }
    //else -> hide all other tooltips in group
    //     -> show selected tooltip
    else
    {
      if(this.window.isTabletPortraitOrLess())
      {
        this.closeAllProfileTooltips();
        this.triggerTooltip.emit();
      }
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

  triggerStats()
  {
    if(this.pokemon && this.pokemon.stats.length > 0)
    {
      if(this.showStats[0]) { this.tooltipStats = this.tooltipStats.fill(false); }
      this.showStats[0] = !this.showStats[0];
      if(this.editorPreview && this.showNotes[0] ) 
      {
        this.showNotes[0] = false; 
        this.triggerNotesEvent.emit(this.showNotes[0]);
      }
    }
  }

  triggerNotes()
  {
    if((this.pokemon && this.pokemon.notes) || this.editorPreview)
    {
      this.showNotes[0] = !this.showNotes[0];
      this.triggerNotesEvent.emit(this.showNotes[0]);
      if(this.editorPreview && this.showStats[0] ) { this.showStats[0] = false; }
    }
  }

  closeAllProfileTooltips()
  {
    this.tooltipEvol = this.tooltipEvol.fill(false);
    this.tooltipTypes = this.tooltipTypes.fill(false);
    this.tooltipLeft = this.tooltipLeft.fill(false);
    this.tooltipMiddle = this.tooltipMiddle.fill(false);
    this.tooltipRight = this.tooltipRight.fill(false);
    this.tooltipRightType = this.tooltipRightType.fill(false);
    this.tooltipStats = this.tooltipStats.fill(false);
  }

  closeAllTooltips()
  {
    this.closeAllProfileTooltips();
    this.showStats = this.showStats.fill(false);
    this.showNotes = this.showNotes.fill(false);
    this.triggerNotesEvent.emit(false);
  }

  copyPokemon()
  {
    if(this.pokemon && this.util.copyToClipboard(this.parser.reverseParsePokemon(this.pokemon)))
    {
      this.copied = true;
    }
    else
    {
      this.copied = false;
    }
  }

  copyReset()
  {
    if(this.copied != undefined) { this.copied = undefined }
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

  calculateMaxStat()
  {
    this.maxStat = Math.max(...this.calculatedStats?.total.map(v => v.value));
    this.updateStats.emit(this.maxStat);
  }

  getStatSize(value: number)
  {
    let maxValue: number = this.teamOptions && this.teamOptions?.maxStat > 0 
    ? this.teamOptions?.maxStat : 700; //the maximun stat value of any pokemons
    return `${value / maxValue * 100}%`;
  }

  calculateStats()
  {
    if(this.pokemon && this.pokemon.stats)
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
          value: this.calculateIV(this.pokemon?.ivs ? this.pokemon.ivs[index].value : 0)
        }
        this.calculatedStats.evs[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateEV(this.pokemon?.evs ? this.pokemon.evs[index].value : 0)
        }
        this.calculatedStats.natures[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.getNatureValue(stat, this.pokemon?.nature)
        }
        this.calculatedStats.total[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateStat(
            stat.value, 
            this.pokemon?.level ? this.pokemon.level : 50,
            this.teamOptions?.ivsVisibility ? this.pokemon?.ivs ? this.pokemon.ivs[index].value : 0 : 0,
            this.teamOptions?.evsVisibility ? this.pokemon?.evs ? this.pokemon.evs[index].value : 0 : 0, 
            this.teamOptions?.naturesVisibility ? this.pokemon?.nature ? this.calculatedStats.natures[index].value : 1 : 1,
            stat.identifier === "hp" ? true : false)
        }
      });
    }
  }

  calculateTotals()
  {
    if(this.pokemon && this.pokemon.stats)
    {
      this.pokemon.stats.forEach((stat, index) => 
      {
        this.calculatedStats.total[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateStat(
            stat.value, 
            this.pokemon?.level ? this.pokemon.level : 50,
            this.teamOptions?.ivsVisibility ? this.pokemon?.ivs ? this.pokemon.ivs[index].value : 0 : 0,
            this.teamOptions?.evsVisibility ? this.pokemon?.evs ? this.pokemon.evs[index].value : 0 : 0, 
            this.teamOptions?.naturesVisibility ? this.pokemon?.nature ? this.calculatedStats.natures[index].value : 1 : 1,
            stat.identifier === "hp" ? true : false)
        }
      });
    }
  }
  
  calculateStat(base: number, inlevel: number, iv: number, ev: number, nature: number, hp: boolean) : number
  {
    //I hate javascript
    let level = Number(inlevel)
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
    return this.calculateStat(baseStat.value, this.pokemon?.level ? this.pokemon.level : 50, 0, 0, 1, baseStat.identifier === "hp" ? true : false);
  }

  calculateIV(iv: number) : number
  {
    return Math.round((iv * (this.pokemon?.level ? this.pokemon.level : 50)) / 100);
  }

  calculateEV(ev: number) : number
  {
    return Math.floor((Math.floor(ev / 4) * (this.pokemon?.level ? this.pokemon.level : 50)) / 100);
  }

  getNatureValue(baseStat?: Stat, nature?: Nature) : number
  {
    let natureValue: number;
    if(baseStat)
    {
      if(nature ? nature.increasedStatIdentifier === baseStat.identifier && nature.decreasedStatIdentifier === baseStat.identifier : false)
      {
        natureValue = 1;
      }
      else if(nature ? nature.increasedStatIdentifier === baseStat.identifier : false)
      {
        natureValue = 1.1;
      }
      else if(nature ? nature.decreasedStatIdentifier === baseStat.identifier : false)
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
