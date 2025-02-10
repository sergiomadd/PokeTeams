import { Component, ElementRef, inject, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenderColors, shinyColor } from 'src/app/core/config/models/colors';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { Pokemon } from 'src/app/features/pokemon/models/pokemon.model';
import { PokemonData } from 'src/app/features/pokemon/models/pokemonData.dto';
import { Stat } from 'src/app/features/pokemon/models/stat.model';
import { PokemonService } from 'src/app/features/pokemon/services/pokemon.service';
import { Team } from 'src/app/features/team/models/team.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { QueryItem } from 'src/app/shared/models/queryResult.model';
import { QueryService } from 'src/app/shared/services/query.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { PokemonComponent } from '../../../pokemon/components/pokemon/pokemon.component';
import { TeamEditorService } from '../../services/team-editor.service';

@Component({
  selector: 'app-pokemon-editor',
  templateUrl: './pokemon-editor.component.html',
  styleUrl: './pokemon-editor.component.scss'
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

  teamKey: string = "";
  team: Team = <Team>{};
  pokemon?: Pokemon;
  selectedPokemonIndex: number = 0;
  readonly genderColors = GenderColors;
  readonly shinyColor = shinyColor;

  @ViewChild(PokemonComponent) pokemonPreviewComponent?: PokemonComponent;
  allAbilities: boolean = false;
  showNotes: boolean = false;
  pokemonFormSubmitted: boolean = false;
  pokemonForm = this.formBuilder.group(
    {
      nickname: ["", [Validators.minLength(1), Validators.maxLength(16)]],
      gender: [false],
      level: [50, [Validators.min(1), Validators.max(100)]],
      ivs: [0],
      evs: [0],
      notes: [""]
    });

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

  @ViewChild('evSlider') evSlider!: ElementRef;

  selectedStat: number = 0;
  currentIVs: number = 0;
  currentEVs: number = 0;
  readonly maxEVs: number = 252;
  readonly maxEVsTotal: number = 508;
  remainingEVs: number[] = [this.maxEVsTotal, this.maxEVsTotal, this.maxEVsTotal, this.maxEVsTotal, this.maxEVsTotal, this.maxEVsTotal];
  ivSliders: string[] = [];
  evSliders: string[] = [];

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes["pokemon"] && this.pokemon)
    {
      this.pokemonForm.controls.nickname.setValue(this.pokemon.nickname ?? "");
      this.pokemonForm.controls.level.setValue(this.pokemon.level ?? 0);
      if(this.pokemon.ivs![this.selectedStat].value != this.pokemonForm.controls.ivs.value)
      {
        this.pokemonForm.controls.ivs.setValue(this.pokemon.ivs[0].value);
        this.calcIVSliderBackground(this.pokemon.ivs[0].value, 0, 31);
      }
      if(this.pokemon.evs![this.selectedStat].value != this.pokemonForm.controls.evs.value)
      {
        this.pokemonForm.controls.evs.setValue(this.pokemon.evs[0].value);
        this.calcEVSliderBackground(this.pokemon.evs[0].value, 0, this.maxEVs);
      }
    }
  }

  async ngOnInit()
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
      this.pokemon = this.team.pokemons[this.selectedPokemonIndex] ?? undefined
    });

    this.pokemonForm.controls.nickname.valueChanges.subscribe(async (value) => 
    {
      if(this.pokemon && this.pokemonForm.controls.nickname.valid)
      {
        this.pokemon.nickname = value ?? undefined;
        this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
      }
    });

    this.pokemonForm.controls.level.valueChanges.subscribe(async (value) => 
    {
      if(this.pokemon && value)
      {
        if(!this.util.isNaN(value))
        {
          if(this.pokemonForm.controls.level.valid)
          {
            this.pokemon = 
            {
              ...this.pokemon,
              level: value ?? 50
            }
            this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
          }
          else
          {
            if(value > 100) 
            {
              this.pokemon = 
              {
                ...this.pokemon,
                level: 100
              }
              this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
            }
            else if(value < 0) 
            {
              this.pokemon = 
              {
                ...this.pokemon,
                level: 1
              }
              this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
            }
          }
        }
        else
        {
          this.pokemonForm.controls.level.setErrors({ "nan": true });
          this.pokemon.level = 50;
        }
      }
    });

    this.pokemonForm.controls.gender.valueChanges.subscribe(async (value) => 
    {
      if(this.pokemon && value)
      {
        this.pokemon = 
        { 
          ...this.pokemon,
          gender: value
        }
        this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);

      }
    });
    
    this.pokemonForm.controls.ivs.valueChanges.subscribe(async (value) => 
    {
      if(this.pokemon && value && value != this.pokemon.ivs![this.selectedStat].value)
      {
        this.currentIVs = value;
        let ivs = this.pokemon.ivs;
        ivs[this.selectedStat].value = value;
        this.pokemon = 
        { 
          ...this.pokemon,
          ivs: ivs
        }
        this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
        this.calcIVSliderBackground(value, 0, 31);
      }
    });
    this.pokemonForm.controls.evs.valueChanges.subscribe(async (value) => 
    {
      if(this.pokemon && value)
      {
        if(this.calculateAvailableEVs(value))
        {
          let evs = this.pokemon.evs;
          evs[this.selectedStat].value = this.currentEVs;
          this.pokemon = 
          { 
            ...this.pokemon,
            evs: evs
          }
          this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
          this.calcEVSliderBackground(this.currentEVs, 0, this.maxEVs);
        }
      }
    });

    this.pokemonForm.controls.notes.valueChanges.subscribe(value =>
      {
        if(this.pokemon && value && this.pokemonForm.controls.notes.valid)
        {
          this.pokemon = { ...this.pokemon, notes: value }
          this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
        }
      })
  }

  selectPokemon(index: number)
  {
    if(index != this.selectedPokemonIndex)
    {
      this.selectedPokemonIndex = index;
      this.pokemon = this.team.pokemons[this.selectedPokemonIndex] ?? undefined;
      this.resetStatPicker();
    }
  }

  addEmptyPokemon()
  {
    this.teamEditorService.addEmptyPokemon();
    this.selectPokemon(this.team.pokemons.length - 1);
  }

  deletePokemon()
  {
    this.teamEditorService.deletePokemon(this.selectedPokemonIndex);
    this.selectPokemon(this.selectedPokemonIndex - 1);
  }


  calcIVSliderBackground(currentValue, min, max)
  {
    var value = Math.ceil((currentValue-min)/(max-min) * 100);
    //hide edges
    if(value > 70) {value -= 2}
    this.ivSliders[this.selectedStat] = 'linear-gradient(to right, lightblue 0%, lightblue ' + value + '%, var(--bg-color-2) ' + value + '%, var(--bg-color-2) 100%)'
  }

  calcEVSliderBackground(currentValue, min, max)
  {
    var value = Math.ceil((currentValue-min)/(max-min) * 100);
    if(value > 70) {value -= 2}
    this.evSliders[this.selectedStat] = 'linear-gradient(to right, gold 0%, gold ' + value + '%, var(--bg-color-2) ' + value + '%, var(--bg-color-2) 100%)'
  }

  allAbilitiesSwitch() 
  { 
    if(this.pokemon)
    {
      this.allAbilities = !this.allAbilities;
      this.pokemon.ability = undefined;
    }
  }

  calculateAvailableEVs(newEVs: number) : boolean
  {
    //Selected more EVs than available
    if(this.remainingEVs[this.selectedPokemonIndex] == 0 && newEVs >= this.currentEVs)
    {
      this.evSlider.nativeElement.value = this.currentEVs;
      return false;
    }
    
    const previousEVs = this.pokemon!.evs[this.selectedStat].value;
    const evDiff = previousEVs - newEVs;
    //If after diff has remaining evs
    if(this.remainingEVs[this.selectedPokemonIndex] + evDiff >= 0)
    {
      this.remainingEVs[this.selectedPokemonIndex] = this.remainingEVs[this.selectedPokemonIndex] + evDiff;
      this.currentEVs = newEVs;
    }
    //If no remaining evs after diff -> add all remaining to current
    else
    {
      this.currentEVs = this.currentEVs + this.remainingEVs[this.selectedPokemonIndex];
      this.remainingEVs[this.selectedPokemonIndex] = 0;
    }
    this.evSlider.nativeElement.value = this.currentEVs;
    return true;
  }

  selectStat(index: number)
  {
    if(this.pokemon)
    {
      if(this.selectedStat === index)
      {
        return;
      }
      else
      {
        this.selectedStat = index;
        this.currentIVs = this.pokemon.ivs[index].value;
        this.currentEVs = this.pokemon.evs[index].value;
        this.evSlider.nativeElement.value = this.currentEVs;
        if(this.pokemonPreviewComponent)
        {
          this.pokemonPreviewComponent.showStats[0] = true;
        }
      }
      this.calcIVSliderBackground(this.pokemon.ivs[index].value, 0, 31);
      this.calcEVSliderBackground(this.pokemon.evs[index].value, 0, this.maxEVs);
    }
  }

  resetStatPicker()
  {
    if(this.pokemon)
    {
      this.selectedStat = 0;
      this.calcIVSliderBackground(this.pokemon.ivs[0].value, 0, 31);
      this.calcEVSliderBackground(this.pokemon.evs[0].value, 0, this.maxEVs);
    }
  }

  async pokemonSelectEvent(event: QueryItem)
  {
    if(this.pokemon)
    {
      if(event)
      {
        const data: PokemonData = await this.pokemonService.getPokemonData(event.name);
        this.pokemon = 
        { 
          ...this.pokemon,
          name: data.name,
          dexNumber: data.dexNumber,
          types: data.types,
          sprite: data.sprite,
          evolutions: data.evolutions,
          preEvolution: data.preEvolution,
          stats: [...data.stats]
        };
        if(this.pokemonPreviewComponent)
        {
          this.pokemonPreviewComponent.showStats[0] = true;
        }
      }
      else
      {
        this.pokemon = 
        { 
          ...this.pokemon,
          name: undefined,
          dexNumber: undefined,
          types: undefined,
          sprite: undefined,
          evolutions: [],
          preEvolution: undefined,
          stats: []
        }
        if(this.pokemonPreviewComponent)
        {
          this.pokemonPreviewComponent.showStats[0] = false;
        }
      }
      this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
    }
  }

  async itemSelectEvent(event: QueryItem)
  {
    if(this.pokemon)
    {
      this.pokemon = { ...this.pokemon, item: event ? await this.pokemonService.getItemByName(event.name) : undefined }
    }
  }

  async abilitySelectEvent(event: QueryItem)
  {
    if(this.pokemon)
    {
      if(event)
      {
        const ability = await this.pokemonService.getAbilityByName(event.name);
        if(event.icon?.includes("hidden"))
        {
          ability.hidden = true;
        }
        this.pokemon = { ...this.pokemon, ability: event ? ability : undefined }
      }
      else
      {
        this.pokemon = { ...this.pokemon, ability: undefined }
      }
      this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
    }
  }

  async move1SelectEvent(event: QueryItem)
  {
    if(this.pokemon)
    {
      this.pokemon.moves[0] = event ? await this.pokemonService.getMove(event.name) : undefined;
      this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
    }
  }

  async move2SelectEvent(event: QueryItem)
  {
    if(this.pokemon)
    {
      this.pokemon.moves[1] = event ? await this.pokemonService.getMove(event.name) : undefined;
      this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
    }
  }

  async move3SelectEvent(event: QueryItem)
  {
    if(this.pokemon)
    {
      this.pokemon.moves[2] = event ? await this.pokemonService.getMove(event.name) : undefined;
      this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
    }
  }

  async move4SelectEvent(event: QueryItem)
  {
    if(this.pokemon)
    {
      this.pokemon.moves[3] = event ? await this.pokemonService.getMove(event.name) : undefined;
      this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
    }
  }

  async natureSelectEvent(event: QueryItem)
  {
    if(this.pokemon)
    {
      this.pokemon.nature = event ? await this.pokemonService.getNatureByName(event.name) : undefined;
    }
  }

  async teraTypeSelectEvent(event: QueryItem)
  {
    if(this.pokemon)
    {
      this.pokemon.teraType = event ? await this.pokemonService.getType(event.name, true) : undefined;
    }
  }

  shinySelectEvent(event: boolean)
  {
    if(this.pokemon)
    {
      this.pokemon = 
      { 
        ...this.pokemon,
        shiny: event
      }
      this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
    }
  }

  genderSelectEvent(event: any)
  {
    if(this.pokemon)
    {
      this.pokemon = 
      { 
        ...this.pokemon,
        gender: event
      }
      this.teamEditorService.updatePokemon(this.pokemon, this.selectedPokemonIndex);
    }
  }

  triggerNotes($event)
  {
    this.showNotes = $event;
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
        || this.pokemonFormSubmitted)) 
      ?? false;
    return invalid;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null =  this.pokemonForm.get(key);
    return this.util.getAuthFormError(control);
  }
}