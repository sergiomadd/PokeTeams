import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LinkifierService } from 'src/app/core/helpers/linkifier.service';
import { ParserService } from 'src/app/core/helpers/parser.service';
import { PokemonStatService } from 'src/app/core/helpers/pokemon-stat.service';
import { ThemeService } from 'src/app/core/helpers/theme.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { FeedbackColors, GenderColors, NatureColors, shinyColor } from 'src/app/core/models/misc/colors';
import { ProcessedString } from 'src/app/core/models/misc/processedString.model';
import { Move } from 'src/app/core/models/pokemon/move.model';
import { Pokemon } from 'src/app/core/models/pokemon/pokemon.model';
import { TeamOptions } from 'src/app/core/models/team/teamOptions.model';
import { selectLang } from 'src/app/core/store/config/config.selectors';
import { CalcMoveEffectivenessPipe } from 'src/app/shared/pipes/pokemon-pipes/calcMoveEffectiveness.pipe';
import { GetDefenseEffectivenessPipe } from 'src/app/shared/pipes/pokemon-pipes/getDefenseEffectivenes.pipe';
import { GetPokemonSpritePathPipe } from 'src/app/shared/pipes/pokemon-pipes/getPokemonSpritePath.pipe';
import { TeamCompareService } from 'src/app/shared/services/team-compare.service';

@Component({
    selector: 'app-pokemon-card',
    templateUrl: './pokemon-card.component.html',
    styleUrl: './pokemon-card.component.scss',
    providers: [
        CalcMoveEffectivenessPipe,
        GetDefenseEffectivenessPipe,
        GetPokemonSpritePathPipe
    ],
    standalone: false
})
export class PokemonCardComponent 
{
  parser = inject(ParserService);
  util = inject(UtilService);
  linkifier = inject(LinkifierService);
  theme = inject(ThemeService);
  store = inject(Store);
  window = inject(WindowService);
  compareService = inject(TeamCompareService);
  pokemonStatService = inject(PokemonStatService);

  calcMoveEffectivenessPipe = inject(CalcMoveEffectivenessPipe);
  getDefenseEffectiveness = inject(GetDefenseEffectivenessPipe);
  getPokemonSpritePath = inject(GetPokemonSpritePathPipe);

  @Input() pokemon?: Pokemon | null;
  @Input() teamOptions?: TeamOptions;
  @Input() showStatsStart?: boolean = false;
  @Input() editorPreview?: boolean = false;
  @Input() compareTeam?: string;
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

  compareEffectiveness?: number;
  teratypeEnabled: boolean = false;

  constructor() 
  {

  }

  async ngOnChanges(changes: SimpleChanges)
  {
    if(changes['teamOptions'])
    {
      this.teamOptions = changes['teamOptions'].currentValue;
      this.pokemonSpritePath = this.getPokemonSpritePath.transform(this.pokemon);
      if(this.pokemon)
      {
        this.pokemon.calculatedStats = this.pokemonStatService.calculateStats(this.pokemon, this.teamOptions);
        this.calculateMaxStat();
      }
    }
    if(changes['pokemon'])
    {
      this.pokemon = changes['pokemon'].currentValue;
      this.pokemonSpritePath = this.getPokemonSpritePath.transform(this.pokemon);
      await this.linkify();
      if(this.pokemon)
      {
        this.pokemon.calculatedStats = this.pokemonStatService.calculateStats(this.pokemon, this.teamOptions);
        this.calculateMaxStat();
      }
    }
  }

  async ngOnInit()
  {
    if(this.showStatsStart)
    {
      this.showStats[0] = true;
    }

    if(this.compareTeam)
    {
      //Missmatch this compareTeam to the other team results
      if(this.compareTeam === "A")
      {
        this.compareService.selectedMoveA$.subscribe((move?: Move) => 
        {
          if(move)
          {
            this.closeAllProfileTooltips();
          }
        })
        this.compareService.selectedMoveB$.subscribe((move?: Move) => 
        {
          this.compareEffectiveness = this.calcMoveEffectivenessPipe.transform(this.getDefenseEffectiveness.transform(this.pokemon, this.teratypeEnabled), move);
        })
      }
      else if(this.compareTeam === "B")
      {
        this.compareService.selectedMoveA$.subscribe((move?: Move) => 
        {
          this.compareEffectiveness = this.calcMoveEffectivenessPipe.transform(this.getDefenseEffectiveness.transform(this.pokemon, this.teratypeEnabled), move);
        })
        this.compareService.selectedMoveB$.subscribe((move?: Move) => 
        {
          if(move)
          {
            this.closeAllProfileTooltips();
          }        
        })
      }
    }
  }

  async linkify()
  {
    if(this.pokemon?.ability?.prose)
    {
      this.abilityProse = this.linkifier.linkifyProse(this.pokemon.ability?.prose.content);
    }
    if(this.pokemon?.item?.prose)
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

  //For tooltip
  clickSection(index: number, type: string, event?)
  {
    let list: boolean[] = [];
    switch(type)
    {
      case "evol":
        list = this.tooltipEvol;
      break;
      case "types":
        list = this.tooltipTypes;
        if(this.compareTeam && index === 0)
        {
          this.teratypeEnabled = !this.teratypeEnabled;
          if(this.compareTeam === 'A')
          {
            this.compareService.setTeratypeSelectedIndexA(index, this.teratypeEnabled);
          }
          else if(this.compareTeam === 'B')
          {
            this.compareService.setTeratypeSelectedIndexB(index, this.teratypeEnabled);          
          }
        } 
      break;
      case "left":
        list = this.tooltipLeft;
      break;
      case "middle":
        list = this.tooltipMiddle;
        break;
      case "right":
        list = this.tooltipRight;
        if(this.compareTeam)
        {
          if(!list[index])
          {
            this.compareMove(index)
          }
          else
          {
            this.compareMove(undefined)
          }
        }
        break;
      case "rightType":
        event.stopPropagation();
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
      if(this.window.isTabletPortraitOrLess() && type !== "rightType")
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

  compareMove(moveIndex?: number)
  {
    if(moveIndex !== undefined)
    {
      if(this.pokemon?.moves[moveIndex])
      {
        if(this.compareTeam === "A")
        {
          this.compareService.setMoveA(this.pokemon.moves[moveIndex]);
        }
        else if(this.compareTeam === "B")
        {
          this.compareService.setMoveB(this.pokemon.moves[moveIndex]);
        }
      }   
    }
    else
    {
      if(this.compareTeam === "A")
      {
        this.compareService.setMoveA(undefined);
      }
      else if(this.compareTeam === "B")
      {
        this.compareService.setMoveB(undefined);
      }
    }
  }

  calculateMaxStat()
  {
    if(this.pokemon?.calculatedStats)
    {
      this.maxStat = Math.max(...this.pokemon.calculatedStats.total.map(v => v.value));
      this.updateStats.emit(this.maxStat);
    }
  }
}
