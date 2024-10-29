import { Component, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Pokemon } from 'src/app/features/pokemon/models/pokemon.model';
import { Stat } from 'src/app/features/pokemon/models/stat.model';
import { PokemonService } from 'src/app/features/pokemon/services/pokemon.service';
import { QueryService } from 'src/app/features/search/services/query.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { TeamOptions } from 'src/app/features/team/models/teamOptions.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { PokemonData } from 'src/app/models/DTOs/pokemonData.dto';
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

  @Input() index: number = 0;
  @Input() teamOptions!: TeamOptions;
  @Input() pokemon!: Pokemon;
  @Output() calculateMaxLvlEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();

  @ViewChild(PokemonComponent) pokemonPreviewComponent!: PokemonComponent;
  allAbilities: boolean = false;

  pokemonFormSubmitted: boolean = false;
  pokemonForm = this.formBuilder.group(
    {
      nickname: ["", [Validators.minLength(1), Validators.maxLength(16)]],
      gender: [false],
      level: [50, [Validators.min(1), Validators.max(100)]],
      ivs: [0],
      evs: [0]
    });


  emptyStat: Stat =   
  {
    name: "",
    identifier: "",
    value: 0
  };
  selectedStat: number = 0;
  currentIVs: number = 0;
  currentEVs: number = 0;
  currentMaxEVs: number = 252;
  evsMax: number = 510;
  usedEVs: number = 0;
  ivs: boolean = false;
  remainingEVs: number = 510;
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
        this.calcEVSliderBackground(this.pokemon.evs[0].value, 0, this.currentMaxEVs);
      }
    }
  }

  async ngOnInit()
  {
    this.pokemonForm.controls.nickname.valueChanges.subscribe(async (value) => 
    {
      if(this.pokemonForm.controls.nickname.valid)
      {
        this.pokemon.nickname = value ?? undefined;
        this.teamEditorService.updatePokemon(this.pokemon, this.index);
      }
    });

    this.pokemonForm.controls.level.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        
        if(typeof +value === "number" && !isNaN(+value))
        {
          if(this.pokemonForm.controls.level.valid)
          {
            this.pokemon.level = value ?? 50;
            this.teamEditorService.updatePokemon(this.pokemon, this.index);
          }
          else
          {
            if(value > 100) { this.pokemon.level = 100 }
            else if(value < 0) { this.pokemon.level = 1 }
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
      if(value)
      {
        this.pokemon = 
        { 
          ...this.pokemon,
          gender: value
        }
        this.teamEditorService.updatePokemon(this.pokemon, this.index);

      }
    });
    
    this.pokemonForm.controls.ivs.valueChanges.subscribe(async (value) => 
    {
      if(value && value != this.pokemon.ivs![this.selectedStat].value)
      {
        this.currentIVs = value;
        let ivs = this.pokemon.ivs;
        ivs[this.selectedStat].value = value;
        this.pokemon = 
        { 
          ...this.pokemon,
          ivs: ivs
        }
        this.teamEditorService.updatePokemon(this.pokemon, this.index);
        this.calcIVSliderBackground(value, 0, 31);
      }
    });
    this.pokemonForm.controls.evs.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        this.currentEVs = value;
        let evs = this.pokemon.evs;
        evs[this.selectedStat].value = value;
        this.pokemon = 
        { 
          ...this.pokemon,
          evs: evs
        }
        this.teamEditorService.updatePokemon(this.pokemon, this.index);
        this.calcEVSliderBackground(value, 0, this.currentMaxEVs);
      }
    });
  }

  calcIVSliderBackground(currentValue, min, max)
  {
    var value = (currentValue-min)/(max-min)*100
    this.ivSliders[this.selectedStat] = 'linear-gradient(to right, lightblue 0%, lightblue ' + value + '%, var(--bg-color-2) ' + value + '%, var(--bg-color-2) 100%)'
  }

  calcEVSliderBackground(currentValue, min, max)
  {
    var value = (currentValue-min)/(max-min)*100
    this.evSliders[this.selectedStat] = 'linear-gradient(to right, gold 0%, gold ' + value + '%, var(--bg-color-2) ' + value + '%, var(--bg-color-2) 100%)'
  }

  deletePokemon()
  {
    this.deleteEvent.emit(this.pokemon);
  }

  allAbilitiesSwitch() 
  { 
    this.allAbilities = !this.allAbilities;
    this.pokemon.ability = undefined;
  }

  calculateAvailableEVs()
  {
    this.remainingEVs -= this.currentEVs;
    if(this.remainingEVs > 252) 
    {
      this.currentMaxEVs = 252;
    }
    else
    {
      this.currentMaxEVs = this.remainingEVs;
    }
  }

  async pokemonSelectEvent(event: Tag)
  {
    if(event)
    {
      const data: PokemonData = await this.pokemonService.getPokemon(event.name);
      this.pokemon = 
      { 
        ...this.pokemon,
        name: event.name,
        dexNumber: data.dexNumber,
        types: data.types,
        sprite: data.sprite,
        evolutions: data.evolutions,
        preEvolution: data.preEvolution,
        stats: [...data.stats]
      };
      this.pokemonPreviewComponent.showStats[0] = true;
      this.teamEditorService.updatePokemon(this.pokemon, this.index);
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
      this.pokemonPreviewComponent.showStats[0] = false;
    }
  }

  async itemSelectEvent(event: Tag)
  {
    this.pokemon = { ...this.pokemon, item: event ? await this.pokemonService.getItemByName(event.name) : undefined }
  }

  async abilitySelectEvent(event: Tag)
  {
    this.pokemon = { ...this.pokemon, ability: event ? await this.pokemonService.getAbilityByName(event.name) : undefined }
    this.teamEditorService.updatePokemon(this.pokemon, this.index);
  }

  async move1SelectEvent(event: Tag)
  {
    this.pokemon.moves[0] = event ? await this.pokemonService.getMove(event.name) : undefined;
    this.teamEditorService.updatePokemon(this.pokemon, this.index);
  }

  async move2SelectEvent(event: Tag)
  {
    this.pokemon.moves[1] = event ? await this.pokemonService.getMove(event.name) : undefined;
    this.teamEditorService.updatePokemon(this.pokemon, this.index);
  }

  async move3SelectEvent(event: Tag)
  {
    this.pokemon.moves[2] = event ? await this.pokemonService.getMove(event.name) : undefined;
    this.teamEditorService.updatePokemon(this.pokemon, this.index);

  }

  async move4SelectEvent(event: Tag)
  {
    this.pokemon.moves[3] = event ? await this.pokemonService.getMove(event.name) : undefined;
    this.teamEditorService.updatePokemon(this.pokemon, this.index);
  }

  async natureSelectEvent(event: Tag)
  {
    this.pokemon.nature = event ? await this.pokemonService.getNatureByName(event.name) : undefined;
  }

  async teraTypeSelectEvent(event: Tag)
  {
    this.pokemon.teraType = event ? await this.pokemonService.getType(event.name, true) : undefined;
  }

  shinySelectEvent(event: boolean)
  {
    this.pokemon = 
    { 
      ...this.pokemon,
      shiny: event
    }
    this.teamEditorService.updatePokemon(this.pokemon, this.index);
  }

  genderSelectEvent(event: any)
  {
    this.pokemon = 
    { 
      ...this.pokemon,
      gender: event
    }
    this.teamEditorService.updatePokemon(this.pokemon, this.index);
  }

  selectStat(index: number)
  {
    if(this.selectedStat === index)
    {
      this.selectedStat = 0;
    }
    else
    {
      this.selectedStat = index;
      this.pokemonForm.controls.ivs.setValue(this.pokemon.ivs![index].value);
      this.currentIVs = 0;
      this.pokemonForm.controls.evs.setValue(this.pokemon.evs![index].value);
      this.currentEVs = 0;
      this.pokemonPreviewComponent.showStats[0] = true;
    }
    this.calcIVSliderBackground(this.pokemon.ivs[index].value, 0, 31);
    this.calcEVSliderBackground(this.pokemon.evs[index].value, 0, this.currentMaxEVs);
  }

  isFormValid()
  {
    return this.pokemonForm.valid
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