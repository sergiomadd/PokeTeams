import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, effect, ElementRef, inject, signal, untracked, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { GenderColors, shinyColor } from '../../../../core/models/misc/colors';
import { QueryItem } from '../../../../core/models/misc/queryResult.model';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { PokemonData } from '../../../../core/models/pokemon/pokemonData.dto';
import { Stat } from '../../../../core/models/pokemon/stat.model';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { QueryService } from '../../../../core/services/query.service';
import { TeamService } from '../../../../core/services/team.service';
import { GetStatColorPipe } from '../../../pipes/color-pipes/getStatColor.pipe';
import { GetStatCodePipe } from '../../../pipes/converters/getStatCode.pipe';
import { GetStatShortIdentifierPipe } from '../../../pipes/converters/getStatShortIdentifier.pipe';
import { GetPokemonSpritePathPipe } from '../../../pipes/pokemon-pipes/getPokemonSpritePath.pipe';
import { TeamEditorService } from '../../../services/team-editor.service';
import { CheckboxComponent } from '../../dumb/checkbox/checkbox.component';
import { RadioComponent } from '../../dumb/radio/radio.component';
import { SmartInputComponent } from '../../smart-input/smart-input.component';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
    selector: 'app-pokemon-editor',
    templateUrl: './pokemon-editor.component.html',
    styleUrl: './pokemon-editor.component.scss',
    providers: [
        GetStatColorPipe
    ],
    imports: [NgClass, FormsModule, ReactiveFormsModule, SmartInputComponent, CheckboxComponent, NgTemplateOutlet, NgStyle, RadioComponent, PokemonCardComponent, TranslatePipe, GetPokemonSpritePathPipe, GetStatColorPipe, GetStatCodePipe, GetStatShortIdentifierPipe]
})
export class PokemonEditorComponent 
{
  queryService = inject(QueryService);
  pokemonService = inject(PokemonService);
  teamService = inject(TeamService);
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);
  teamEditorService = inject(TeamEditorService)
  router = inject(Router);
  window = inject(WindowService);
  theme = inject(ThemeService);

  getStatColor = inject(GetStatColorPipe);

  team = this.teamEditorService.team;
  pokemon = signal<Pokemon | undefined>(undefined)
  selectedPokemonIndex = signal<number>(0);
  readonly genderColors = GenderColors;
  readonly shinyColor = shinyColor;

  readonly pokemonPreviewComponent = viewChild(PokemonCardComponent);
  allAbilities = signal<boolean>(false);
  showNotes = signal<boolean>(false);
  pokemonFormSubmitted = signal<boolean>(false);
  pokemonForm = this.formBuilder.group(
    {
      nickname: ["", [Validators.minLength(1), Validators.maxLength(16)]],
      gender: [false],
      level: [50, [Validators.min(1), Validators.max(100)]],
      ivs: [0, [Validators.min(0), Validators.max(31)]],
      evs: [0, [Validators.min(0), Validators.max(252)]],
      notes: [""]
    });

  formNickname = toSignal(this.pokemonForm.controls.nickname.valueChanges)
  formGender = toSignal(this.pokemonForm.controls.gender.valueChanges)
  formLevel = toSignal(this.pokemonForm.controls.level.valueChanges)
  formIVs = toSignal(this.pokemonForm.controls.ivs.valueChanges)
  formEVs = toSignal(this.pokemonForm.controls.evs.valueChanges)
  formNotes = toSignal(this.pokemonForm.controls.notes.valueChanges)

  emptyStat: Stat =   
  {
    name: 
    {
      content: "",
      language: "en"
    },
    identifier: "",
    value: 0
  };

  readonly evSlider = viewChild.required<ElementRef>('evSlider');

  selectedStat = signal<number>(0);
  currentIVs = signal<number>(0);
  currentEVs = signal<number>(0);
  readonly maxEVs: number = 252;
  readonly maxEVsTotal: number = 510;
  remainingEVs = signal<number>(this.maxEVsTotal);
  ivSliders = signal<string[]>([]);
  evSliders = signal<string[]>([]);

  selectedTheme = toSignal(this.theme.selectedTheme$);

  constructor()
  {
    effect(() =>
    {
      this.pokemon();
      this.calcRemainigEVs();
    })

    effect(() =>
    {
      const team = this.team();
      if(!team) { return; }
      const pokemon = team.pokemons[this.selectedPokemonIndex()] ?? undefined;
      this.pokemon.set(pokemon)
      if(pokemon)
      {
        //this.selectPokemon(this.selectedPokemonIndex());
        if((pokemon.nickname ?? "") !== this.pokemonForm.controls.nickname.value)
        {
          this.pokemonForm.controls.nickname.setValue(pokemon.nickname ?? "", {emitEvent:false});
        }
        if((pokemon.level ?? 0) !== this.pokemonForm.controls.level.value)
        {
          this.pokemonForm.controls.level.setValue(pokemon.level ?? 0, {emitEvent:false});
        }
        if(pokemon.ivs[this.selectedStat()] && pokemon.ivs[this.selectedStat()].value != this.pokemonForm.controls.ivs.value)
        {
          this.pokemonForm.controls.ivs.setValue(pokemon.ivs[this.selectedStat()].value, {emitEvent:false});
          this.currentIVs.set(pokemon.ivs[this.selectedStat()].value);
          this.calcIVSliderBackground(pokemon.ivs[this.selectedStat()].value, 0, 31);
        }
        if(pokemon.evs[this.selectedStat()] && pokemon.evs[this.selectedStat()].value != this.pokemonForm.controls.evs.value)
        {
          this.pokemonForm.controls.evs.setValue(pokemon.evs[this.selectedStat()].value, {emitEvent:false});
          this.currentEVs.set(pokemon.evs[this.selectedStat()].value);
          this.calcEVSliderBackground(pokemon.evs[this.selectedStat()].value, 0, this.maxEVs);
        }
      }
    })

    effect(() =>
    {
      const nickname = this.formNickname();
      if(this.pokemonForm.controls.nickname.valid && untracked(() => this.pokemon()?.nickname) !== (nickname ?? undefined))
      {
        this.pokemon.update(pokemon =>
        {
          if(!pokemon) { return undefined; }
          return {
            ...pokemon,
            nickname: nickname ?? undefined
          }
        });
        untracked(() => this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex()));
      }
    })

    effect(() =>
    {
      const level = this.formLevel();
      if(level)
      {
        if(!this.util.isNaN(level))
        {
          if(this.pokemonForm.controls.level.valid)
          {
            if(untracked(() => this.pokemon()?.level) !== Number(level))
            {
              this.pokemon.update(pokemon => pokemon && { ...pokemon, level: Number(level) });
              untracked(() => this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex()));
            }
          }
          else
          {
            if(level > 100)
            {
              this.pokemon.update(pokemon => pokemon && { ...pokemon, level: 100 });
              untracked(() => this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex()));
            }
            else if(level < 0)
            {
              this.pokemon.update(pokemon => pokemon && { ...pokemon, level: 1 });
              untracked(() => this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex()));
            }
          }
        }
        else
        {
          this.pokemonForm.controls.level.setErrors({ "nan": true });
          this.pokemon.update(pokemon => pokemon && { ...pokemon, level: 50 });
        }
      }
    })

    effect(() =>
    {
      const gender = this.formGender();
      if(gender && untracked(() => this.pokemon()?.gender) !== gender)
      {
        this.pokemon.update(pokemon => pokemon && { ...pokemon, gender: gender });
        untracked(() => this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex()));
      }
    })

    effect(() => 
    {
      let ivs = this.formIVs();
      let pokemon = this.pokemon();
      if(pokemon && ivs != undefined && (pokemon.ivs[this.selectedStat()] && pokemon.ivs[this.selectedStat()].value != ivs))
      {
        if(!this.util.isNaN(ivs))
        {
          if(this.pokemonForm.controls.ivs.valid)
          {
            this.currentIVs.set(Number(ivs));
            let pokemonIVs = pokemon.ivs;
            pokemonIVs[this.selectedStat()].value = this.currentIVs();
            this.pokemon.update(pokemon => pokemon && { ...pokemon, ivs: pokemonIVs })
            this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
            this.calcIVSliderBackground(this.currentIVs(), 0, 31);
          }
          else
          {
            if(ivs > 31) 
            {
              ivs = 31;
              this.currentIVs.set(31);
              let pokemonIVs = pokemon.ivs;
              pokemonIVs[this.selectedStat()].value = this.currentIVs();
              this.pokemon.update(pokemon => pokemon && { ...pokemon, ivs: pokemonIVs })
              this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
              this.calcIVSliderBackground(ivs, 0, 31);
            }
            else if(ivs < 0) 
            {
              ivs = 0;
              this.currentIVs.set(0);
              let pokemonIVs = pokemon.ivs;
              pokemonIVs[this.selectedStat()].value = this.currentIVs();
              this.pokemon.update(pokemon => pokemon && { ...pokemon, ivs: pokemonIVs })
              this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
              this.calcIVSliderBackground(ivs, 0, 31);
            }
          }
        }
        else
        {
          this.pokemonForm.controls.ivs.setErrors({ "nan": true });
        }
      }
    });

    effect(() => 
    {
      let evs = this.formEVs();
      let pokemon = this.pokemon();
      if(pokemon && evs != undefined && (pokemon.evs[this.selectedStat()] && pokemon.evs[this.selectedStat()].value != evs ))
      {
        if(!this.util.isNaN(evs))
        {
          if(this.pokemonForm.controls.evs.valid)
          {
            if(this.calculateAvailableEVs(Number(evs)))
            {
              let pokemonEVs = pokemon.evs;
              pokemonEVs[this.selectedStat()].value = this.currentEVs();
              this.pokemon.update(pokemon => pokemon && { ...pokemon, evs: pokemonEVs })
              this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
              this.calcEVSliderBackground(this.currentEVs(), 0, this.maxEVs);
            }
          }
          else
          {
            if(evs > 252)
            {
              evs = 252;
              if(this.calculateAvailableEVs(evs))
              {
                let pokemonEVs = pokemon.evs;
                pokemonEVs[this.selectedStat()].value = this.currentEVs();
                this.pokemon.update(pokemon => pokemon && { ...pokemon, evs: pokemonEVs })
                this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
                this.calcEVSliderBackground(this.currentEVs(), 0, this.maxEVs);
              }
            }
            else if(evs < 0)
            {
              evs = 0;
              if(this.calculateAvailableEVs(evs))
              {
                let pokemonEVs = pokemon.evs;
                pokemonEVs[this.selectedStat()].value = this.currentEVs();
                this.pokemon.update(pokemon => pokemon && { ...pokemon, evs: pokemonEVs })
                this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
                this.calcEVSliderBackground(this.currentEVs(), 0, this.maxEVs);
              }
            }
          }
        }
        else
        {
          this.pokemonForm.controls.evs.setErrors({ "nan": true });
        }
      }
    })

    effect(() =>
    {
      const notes = this.formNotes();
      if(notes && this.pokemonForm.controls.notes.valid && untracked(() => this.pokemon()?.notes) !== notes)
      {
        this.pokemon.update(pokemon => pokemon && { ...pokemon, notes: notes })
        untracked(() => this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex()));
      }
    })

    effect(() =>
    {
      this.selectedTheme();
      const pokemon = this.pokemon();
      if(pokemon)
      {
        if(pokemon.ivs && pokemon.ivs[this.selectedStat()])
        {
          this.calcIVSliderBackground(pokemon.ivs[this.selectedStat()].value, 0, 31);
        }
        if(pokemon.evs && pokemon.evs[this.selectedStat()])
        {
          this.calcEVSliderBackground(pokemon.evs[this.selectedStat()].value, 0, this.maxEVs);
        }
      }
    })
  }

  calcRemainigEVs()
  {
    let remaining = this.maxEVsTotal;
    let pokemon = this.pokemon();
    if(pokemon && pokemon.evs)
    {
      for (const ev of pokemon.evs)
      {
        remaining -= ev.value;
      }
    }
    this.remainingEVs.set(remaining);
  }

  selectPokemon(index: number)
  {
    if(index != this.selectedPokemonIndex())
    {
      this.selectedPokemonIndex.set(index);
      this.pokemon.set(this.team().pokemons[this.selectedPokemonIndex()] ?? undefined);
      this.resetStatPicker();
      this.remainingEVs.set(this.maxEVsTotal);
      this.calcRemainigEVs();
    }
  }

  addEmptyPokemon()
  {
    this.teamEditorService.addEmptyPokemon();
    this.selectPokemon(this.team().pokemons.length - 1);
  }

  deletePokemon()
  {
    this.teamEditorService.deletePokemon(this.selectedPokemonIndex());
    if(this.selectedPokemonIndex() > 0)
    {
      this.selectPokemon(this.selectedPokemonIndex() - 1);
    }
  }

  calcIVSliderBackground(currentValue, min, max)
  {
    const ivColor = this.getStatColor.transform("iv", this.theme.selectedThemeName);
    var value = Math.ceil((currentValue-min)/(max-min) * 100);
    //hide edges
    if(value > 70) {value -= 2}
    const gradient = 'linear-gradient(to right, ' + ivColor + ' 0%, ' + ivColor + value + '%, var(--bg-color-2) ' + value + '%, var(--bg-color-2) 100%)';
    this.ivSliders.update(sliders =>
    {
      const updated = [...sliders];
      updated[this.selectedStat()] = gradient;
      return updated;
    });
  }

  calcEVSliderBackground(currentValue, min, max)
  {
    const evColor = this.getStatColor.transform("ev", this.theme.selectedThemeName);
    var value = Math.ceil((currentValue-min)/(max-min) * 100);
    if(value > 70) {value -= 2}
    const gradient = 'linear-gradient(to right, ' + evColor + ' 0%, ' + evColor + value + '%, var(--bg-color-2)' + value + '%, var(--bg-color-2) 100%)';
    this.evSliders.update(sliders =>
    {
      const updated = [...sliders];
      updated[this.selectedStat()] = gradient;
      return updated;
    });
  }

  allAbilitiesSwitch() 
  { 
    if(this.pokemon())
    {
      this.allAbilities.update(value => !value);
      this.pokemon.update(pokemon => pokemon && { ...pokemon, ability: undefined})
    }
  }

  calculateAvailableEVs(newEVs: number) : boolean
  {
    //Selected more EVs than available
    if(this.remainingEVs() <= 0 && newEVs >= this.currentEVs())
    {
      this.evSlider().nativeElement.value = this.currentEVs();
      return false;
    }

    const previousEVs = this.pokemon()?.evs[this.selectedStat()].value ?? 0;
    const evDiff = previousEVs - newEVs;
    //If after diff has remaining evs
    if(this.remainingEVs() + evDiff >= 0)
    {
      this.remainingEVs.update(remaining => remaining + evDiff);
      this.currentEVs.set(newEVs);
    }
    //If no remaining evs after diff -> add all remaining to current
    else
    {
      this.currentEVs.update(currentEVs => Math.max(0, currentEVs + this.remainingEVs()));
      this.remainingEVs.set(0);
    }
    this.evSlider().nativeElement.value = this.currentEVs();
    return true;
  }

  calcAllEVs()
  {
    for (const pokemon of this.team().pokemons) 
    {
      if(pokemon)
      {
        for (const ev of pokemon?.evs)
        {
          this.remainingEVs.update(remaining => remaining - ev.value);
        }
      }
    }
  }

  selectStat(index: number)
  {
    const pokemon = this.pokemon();
    if(pokemon)
    {
      if(this.selectedStat() === index)
      {
        return;
      }
      else
      {
        this.selectedStat.set(index);
        this.currentIVs.set(pokemon.ivs[index].value);
        this.pokemonForm.controls.ivs.setValue(this.currentIVs());
        this.currentEVs.set(pokemon.evs[index].value);
        this.pokemonForm.controls.evs.setValue(this.currentEVs());
        this.evSlider().nativeElement.value = this.currentEVs();
       const pokemonPreviewComponent = this.pokemonPreviewComponent();
       if(pokemonPreviewComponent)
        {
          pokemonPreviewComponent.showStats[0] = true;
        }
      }
      this.calcIVSliderBackground(pokemon.ivs[index].value, 0, 31);
      this.calcEVSliderBackground(pokemon.evs[index].value, 0, this.maxEVs);
    }
  }

  resetStatPicker()
  {
    const pokemon = this.pokemon();
    if(pokemon)
    {
      this.selectedStat.set(0);
      this.calcIVSliderBackground(pokemon.ivs[0].value, 0, 31);
      this.calcEVSliderBackground(pokemon.evs[0].value, 0, this.maxEVs);
      this.currentIVs.set(pokemon.ivs[0].value);
      this.pokemonForm.controls.ivs.setValue(this.currentIVs());
      this.currentEVs.set(pokemon.evs[0].value);
      this.pokemonForm.controls.evs.setValue(this.currentEVs());
      this.evSlider().nativeElement.value = this.currentEVs();
    }
  }

  resetIVs()
  {
    const pokemon = this.pokemon();
    if(pokemon)
    {
      for (const iv of pokemon.ivs)
      {
        iv.value = 0;
      }
      this.pokemon.update(pk => pk && { ...pk, ivs: pokemon.ivs})
      this.currentIVs.set(pokemon.ivs[this.selectedStat()].value);
      this.pokemonForm.controls.ivs.setValue(this.currentIVs(), {emitEvent:false});
      this.calcIVSliderBackground(pokemon.ivs[this.selectedStat()].value, 0, 31);
    }
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  resetEVs()
  {
    const pokemon = this.pokemon();
    if(pokemon)
    {
      for (const ev of pokemon.evs)
      {
        ev.value = 0;
      }
      this.pokemon.update(pk => pk && { ...pk, evs: pokemon.evs})
      this.currentEVs.set(pokemon.evs[this.selectedStat()].value);
      this.pokemonForm.controls.evs.setValue(this.currentEVs(), {emitEvent:false});
      this.evSlider().nativeElement.value = this.currentEVs();
      this.remainingEVs.set(this.maxEVsTotal);
      this.calcEVSliderBackground(pokemon.evs[this.selectedStat()].value, 0, this.maxEVs);
    }
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  async pokemonSelectEvent(event?: QueryItem)
  {
    const pokemon = this.pokemon();
    if(pokemon)
    {
      if(event)
      {
        const data: PokemonData = await this.pokemonService.getPokemonDataByDexNumber(event.identifier);
        this.pokemon.update(pokemon => pokemon && 
          { 
            ...pokemon,
            name: data.name,
            dexNumber: data.dexNumber,
            pokemonId: data.pokemonId,
            types: data.types,
            sprite: data.sprite,
            evolutions: data.evolutions,
            preEvolution: data.preEvolution,
            formId: data.formId,
            forms: data.forms,
            stats: [...data.stats]
          }
        )
        const pokemonPreviewComponent = this.pokemonPreviewComponent();
        if(pokemonPreviewComponent)
        {
          pokemonPreviewComponent.showStats[0] = true;
        }
      }
      else
      {
        this.pokemon.update(pokemon => pokemon && 
          { 
            ...pokemon,
            name: undefined,
            dexNumber: undefined,
            pokemonId: undefined,
            types: undefined,
            sprite: undefined,
            evolutions: [],
            preEvolution: undefined,
            formId: undefined,
            forms: undefined,
            stats: []
          }
        )
        const pokemonPreviewComponent = this.pokemonPreviewComponent();
        if(pokemonPreviewComponent)
        {
          pokemonPreviewComponent.showStats[0] = false;
        }
      }
    }
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  async itemSelectEvent(event?: QueryItem)
  {
    const item = event ? await this.pokemonService.getItemByName(event.name) : undefined;
    this.pokemon.update(pokemon => pokemon && { ...pokemon, item: item })
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  async abilitySelectEvent(event?: QueryItem)
  {
    const ability = await this.pokemonService.getAbilityByName(event?.name || "");
    if(event?.icon?.includes("hidden"))
    {
      ability.hidden = true;
    }
    this.pokemon.update(pokemon => pokemon && { ...pokemon, ability: event ? ability : undefined })
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  async move1SelectEvent(event?: QueryItem)
  {
    const move = event ? await this.pokemonService.getMove(event.name) : undefined;
    this.pokemon.update(pokemon => pokemon && 
    {
      ...pokemon,
      moves: pokemon.moves.map((m, i) => i === 0 ? move : m)
    });
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  async move2SelectEvent(event?: QueryItem)
  {
    const move = event ? await this.pokemonService.getMove(event.name) : undefined;
    this.pokemon.update(pokemon => pokemon && 
    {
      ...pokemon,
      moves: pokemon.moves.map((m, i) => i === 1 ? move : m)
    });
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  async move3SelectEvent(event?: QueryItem)
  {
    const move = event ? await this.pokemonService.getMove(event.name) : undefined;
    this.pokemon.update(pokemon => pokemon && 
    {
      ...pokemon,
      moves: pokemon.moves.map((m, i) => i === 2 ? move : m)
    });
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  async move4SelectEvent(event?: QueryItem)
  {
    const move = event ? await this.pokemonService.getMove(event.name) : undefined;
    this.pokemon.update(pokemon => pokemon && 
    {
      ...pokemon,
      moves: pokemon.moves.map((m, i) => i === 3 ? move : m)
    });
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  async natureSelectEvent(event?: QueryItem)
  {
    const nature = event ? await this.pokemonService.getNatureByName(event.name) : undefined;
    this.pokemon.update(pokemon => pokemon && { ...pokemon, nature: nature })
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  async teraTypeSelectEvent(event?: QueryItem)
  {
    const teraType = event ? await this.pokemonService.getType(event.identifier, true) : undefined;
    this.pokemon.update(pokemon => pokemon && { ...pokemon, teraType: teraType })
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  shinySelectEvent(event: boolean)
  {
    if(this.pokemon() && this.pokemon()?.shiny !== event)
    {
      this.pokemon.update(pokemon => pokemon && { ...pokemon, shiny: event})
    }
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  genderSelectEvent(event?: any)
  {
    this.pokemon.update(pokemon => pokemon && { ...pokemon, gender: event})
    this.teamEditorService.updatePokemon(this.pokemon(), this.selectedPokemonIndex());
  }

  triggerNotes($event: boolean)
  {
    this.showNotes.set($event);
  }

  isFormValid()
  {
    return this.pokemonForm.valid;
  }

  isInvalid(key: string) : boolean
  {
    var control = this.pokemonForm.get(key);
    let invalid = (control?.errors
      && (control?.dirty || control?.touched
        || this.pokemonFormSubmitted())) 
      ?? false;
    return invalid;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null =  this.pokemonForm.get(key);
    return this.util.getAuthFormError(control);
  }
}