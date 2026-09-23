import { Component, effect, inject, input, model, output, signal, untracked, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LinkifierService } from '../../../../core/helpers/linkifier.service';
import { ParserService } from '../../../../core/helpers/parser.service';
import { PokemonStatService } from '../../../../core/helpers/pokemon-stat.service';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { FeedbackColors, GenderColors, shinyColor } from '../../../../core/models/misc/colors';
import { ProcessedString } from '../../../../core/models/misc/processedString.model';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { TeamOptions } from '../../../../core/models/team/teamOptions.model';
import { selectLang } from '../../../../core/store/config/config.selectors';
import { CalcMoveEffectivenessPipe } from '../../../pipes/pokemon-pipes/calcMoveEffectiveness.pipe';
import { GetDefenseEffectivenessPipe } from '../../../pipes/pokemon-pipes/getDefenseEffectivenes.pipe';
import { GetPokemonSpritePathPipe } from '../../../pipes/pokemon-pipes/getPokemonSpritePath.pipe';
import { TeamCompareService } from '../../../services/team-compare.service';
import { NgClass, NgTemplateOutlet, NgStyle, AsyncPipe } from '@angular/common';
import { PokeTooltipComponent } from '../poke-tooltip/poke-tooltip.component';
import { EvolutionComponent } from '../evolution/evolution.component';
import { NoTranslationComponent } from '../../dumb/no-translation/no-translation.component';
import { PokemonProseComponent } from '../pokemon-prose/pokemon-prose.component';
import { PokemonStatRowComponent } from '../pokemon-stat-row/pokemon-stat-row.component';
import { PokemonMoveSlotComponent } from '../pokemon-move-slot/pokemon-move-slot.component';
import { PokemonTypeBadgesComponent } from '../pokemon-type-badges/pokemon-type-badges.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-pokemon-card',
    templateUrl: './pokemon-card.component.html',
    styleUrl: './pokemon-card.component.scss',
    providers: [
        CalcMoveEffectivenessPipe,
        GetDefenseEffectivenessPipe,
        GetPokemonSpritePathPipe
    ],
    imports: [NgClass, PokeTooltipComponent, EvolutionComponent, NoTranslationComponent, PokemonProseComponent, PokemonStatRowComponent, PokemonMoveSlotComponent, PokemonTypeBadgesComponent, NgTemplateOutlet, NgStyle, AsyncPipe, TranslatePipe]
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

  readonly pokemon = model<Pokemon | null>();
  readonly teamOptions = model<TeamOptions>();
  readonly showStatsStart = input<boolean | undefined>(false);
  readonly editorPreview = input<boolean | undefined>(false);
  readonly compareTeam = input<string>();
  readonly triggerNotesEvent = output<boolean>();
  readonly updateStats = output<number>();
  readonly triggerTooltip = output();

  selectedLang$: Observable<string> = this.store.select(selectLang);
  selectedLang?: string;

  pokemonSpritePath = signal<string | undefined>('');
  spriteCategory: number = 0;
  copied = signal<boolean | undefined>(undefined);
  readonly genderColors = GenderColors;
  readonly shinyColor = shinyColor;
  readonly feedbackColors = FeedbackColors;

  maxStat = signal<number>(0);

  abilityProse = signal<ProcessedString[]>([]);
  itemProse = signal<ProcessedString[]>([]);
  moveEffectsShort = signal<ProcessedString[][]>([[], [], [], []]);
  moveEffectsLong: ProcessedString[][] = [];
  moveTargets = signal<ProcessedString[][]>([[], [], [], []]);

  tooltipEvol = signal<boolean[]>([false]);
  tooltipTypes = signal<boolean[]>([false, false]);
  tooltipLeft = signal<boolean[]>([false, false]);
  tooltipMiddle = signal<boolean[]>([false]);
  tooltipRight = signal<boolean[]>([false, false, false, false]);
  tooltipRightType = signal<boolean[]>([false, false, false, false]);
  tooltipRightClass = signal<boolean[]>([false, false, false, false]);
  showStats = signal<boolean[]>([false]);
  showNotes = signal<boolean[]>([false]);
  tooltipStats = signal<boolean[]>([false, false, false, false, false, false]);

  private readonly tooltipGroups: WritableSignal<boolean[]>[] = [
    this.tooltipEvol, this.tooltipTypes, this.tooltipLeft, this.tooltipMiddle,
    this.tooltipRight, this.tooltipRightType, this.tooltipRightClass, this.tooltipStats
  ];

  compareEffectiveness = signal<number | undefined>(undefined);
  teratypeEnabled = signal<boolean>(false);

  constructor()
  {
    effect(() =>
    {
      const moveA = this.compareService.selectedMoveA();
      const compareTeam = untracked(() => this.compareTeam());
      if(compareTeam === "A")
      {
        if(moveA)
        {
          this.closeAllProfileTooltips();
        }
      }
      else if(compareTeam === "B")
      {
        this.compareEffectiveness.set(this.calcMoveEffectivenessPipe.transform(
          this.getDefenseEffectiveness.transform(untracked(() => this.pokemon()), untracked(() => this.teratypeEnabled())), moveA));
      }
    });

    effect(() =>
    {
      const moveB = this.compareService.selectedMoveB();
      const compareTeam = untracked(() => this.compareTeam());
      if(compareTeam === "A")
      {
        this.compareEffectiveness.set(this.calcMoveEffectivenessPipe.transform(
          this.getDefenseEffectiveness.transform(untracked(() => this.pokemon()), untracked(() => this.teratypeEnabled())), moveB));
      }
      else if(compareTeam === "B")
      {
        if(moveB)
        {
          this.closeAllProfileTooltips();
        }
      }
    });

    effect(() =>
    {
      const pokemon = this.pokemon();
      const teamOptions = this.teamOptions();
      this.pokemonSpritePath.set(this.getPokemonSpritePath.transform(pokemon));
      if(pokemon)
      {
        pokemon.calculatedStats = this.pokemonStatService.calculateStats(pokemon, teamOptions);
        this.calculateMaxStat();
      }
    });

    let previousPokemon: Pokemon | null | undefined;
    effect(() =>
    {
      const pokemon = this.pokemon();
      const shouldRelink = !previousPokemon || !pokemon
        || previousPokemon.ability !== pokemon.ability
        || previousPokemon.item !== pokemon.item
        || previousPokemon.moves[0] !== pokemon.moves[0]
        || previousPokemon.moves[1] !== pokemon.moves[1]
        || previousPokemon.moves[2] !== pokemon.moves[2]
        || previousPokemon.moves[3] !== pokemon.moves[3];
      previousPokemon = pokemon;
      if(shouldRelink)
      {
        untracked(() => this.linkify());
      }
    });
  }

  ngOnInit()
  {
    if(this.showStatsStart())
    {
      this.showStats.set([true]);
    }
  }

  async linkify()
  {
    const pokemon = this.pokemon();
    if(pokemon?.ability?.prose)
    {
      this.abilityProse.set(this.linkifier.linkifyProse(pokemon.ability?.prose.content));
    }
    if(pokemon?.item?.prose)
    {
      this.itemProse.set(this.linkifier.linkifyProse(pokemon.item?.prose.content));
    }
    const moveEffectsShort = [...this.moveEffectsShort()];
    const moveTargets = [...this.moveTargets()];
    for(let i = 0; i < 4; i++)
    {
      const move = pokemon?.moves?.[i];
      if(move && move.effect)
      {
        moveEffectsShort[i] = this.linkifier.linkifyProse(move.effect.short.content);
        this.moveEffectsLong[i] = this.linkifier.linkifyProse(move.effect.long.content);
        moveTargets[i] = this.linkifier.linkifyProse(move.target?.description.content);
      }
    }
    this.moveEffectsShort.set(moveEffectsShort);
    this.moveTargets.set(moveTargets);
  }

  //For tooltip
  clickSection(index: number, type: string, event?)
  {
    const groupSignal = this.getTooltipGroup(type);
    if(!groupSignal) { return; }
    const compareTeam = this.compareTeam();
    switch(type)
    {
      case "types":
        if(compareTeam && index === 0)
        {
          const teratypeEnabled = !this.teratypeEnabled();
          this.teratypeEnabled.set(teratypeEnabled);
          if(compareTeam === 'A')
          {
            this.compareService.setTeratypeSelectedIndexA(index, teratypeEnabled);
          }
          else if(compareTeam === 'B')
          {
            this.compareService.setTeratypeSelectedIndexB(index, teratypeEnabled);
          }
        }
      break;
      case "right":
        if(compareTeam)
        {
          if(!groupSignal()[index])
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
        break;
    }

    //If tooltip visible -> hide it
    if(groupSignal()[index])
    {
      //Close nested tooltip if open
      if(type === "right" && this.tooltipRightType()[index])
      {
        this.closeAt(this.tooltipRightType, index);
      }
      if(type === "right" && this.tooltipRightClass()[index])
      {
        this.closeAt(this.tooltipRightClass, index);
      }
      this.closeAt(groupSignal, index);
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
      const previous = groupSignal();
      const currentRightType = this.tooltipRightType();
      for(let i = 0; i < previous.length; i++)
      {
        //Close nested tooltip if open
        if(previous[i] && currentRightType[i])
        {
          this.closeAt(this.tooltipRightType, i);
        }
      }
      groupSignal.update(arr => arr.map((_, i) => i === index));
    }
  }

  private getTooltipGroup(type: string): WritableSignal<boolean[]> | undefined
  {
    switch(type)
    {
      case "evol": return this.tooltipEvol;
      case "types": return this.tooltipTypes;
      case "left": return this.tooltipLeft;
      case "middle": return this.tooltipMiddle;
      case "right": return this.tooltipRight;
      case "rightType": return this.tooltipRightType;
      case "rightClass": return this.tooltipRightClass;
      case "stat": return this.tooltipStats;
      default: return undefined;
    }
  }

  private closeAt(sig: WritableSignal<boolean[]>, index: number)
  {
    sig.update(arr => arr.map((v, i) => i === index ? false : v));
  }

  triggerStats()
  {
    const pokemon = this.pokemon();
    if(pokemon && pokemon.stats.length > 0)
    {
      if(this.showStats()[0]) { this.tooltipStats.set(this.tooltipStats().map(() => false)); }
      this.showStats.update(s => [!s[0]]);
      if(this.editorPreview() && this.showNotes()[0])
      {
        this.showNotes.set([false]);
        this.triggerNotesEvent.emit(false);
      }
    }
  }

  triggerNotes()
  {
    const pokemon = this.pokemon();
    const editorPreview = this.editorPreview();
    if((pokemon && pokemon.notes) || editorPreview)
    {
      const nextShowNotes = !this.showNotes()[0];
      this.showNotes.set([nextShowNotes]);
      this.triggerNotesEvent.emit(nextShowNotes);
      if(editorPreview && this.showStats()[0]) { this.showStats.set([false]); }
    }
  }

  setStatsVisible(visible: boolean)
  {
    this.showStats.set([visible]);
  }

  setNotesVisible(visible: boolean)
  {
    this.showNotes.set([visible]);
  }

  closeAllProfileTooltips()
  {
    for(const group of this.tooltipGroups)
    {
      group.set(group().map(() => false));
    }
  }

  closeAllTooltips()
  {
    this.closeAllProfileTooltips();
    this.showStats.set(this.showStats().map(() => false));
    this.showNotes.set(this.showNotes().map(() => false));
    this.triggerNotesEvent.emit(false);
  }

  copyPokemon()
  {
    const pokemon = this.pokemon();
    if(pokemon && this.util.copyToClipboard(this.parser.reverseParsePokemon(pokemon)))
    {
      this.copied.set(true);
    }
    else
    {
      this.copied.set(false);
    }
  }

  copyReset()
  {
    if(this.copied() != undefined) { this.copied.set(undefined) }
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
      const pokemon = this.pokemon();
      if(pokemon?.moves[moveIndex])
      {
        const compareTeam = this.compareTeam();
        if(compareTeam === "A")
        {
          this.compareService.setMoveA(pokemon.moves[moveIndex]);
        }
        else if(compareTeam === "B")
        {
          this.compareService.setMoveB(pokemon.moves[moveIndex]);
        }
      }
    }
    else
    {
      const compareTeam = this.compareTeam();
      if(compareTeam === "A")
      {
        this.compareService.setMoveA(undefined);
      }
      else if(compareTeam === "B")
      {
        this.compareService.setMoveB(undefined);
      }
    }
  }

  calculateMaxStat()
  {
    const pokemon = this.pokemon();
    if(pokemon?.calculatedStats)
    {
      const maxStat = Math.max(...pokemon.calculatedStats.total.map(v => v.value));
      this.maxStat.set(maxStat);
      this.updateStats.emit(maxStat);
    }
  }
}
