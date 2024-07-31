import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PokemonData } from 'src/app/models/DTOs/pokemonData.dto';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { Stat } from 'src/app/models/pokemon/stat.model';
import { Tag } from 'src/app/models/tag.model';
import { TeamOptions } from 'src/app/models/teamOptions.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { QueryService } from 'src/app/services/query.service';
import { TeamService } from 'src/app/services/team.service';
import { UtilService } from 'src/app/services/util.service';
import { SmartInputComponent } from '../pieces/smart-input/smart-input.component';
import { PokemonComponent } from '../pokemon/pokemon.component';

@Component({
  selector: 'app-pokemon-creator',
  templateUrl: './pokemon-creator.component.html',
  styleUrl: './pokemon-creator.component.scss',
  //this is a problem!!!
})
export class PokemonCreatorComponent 
{
  queryService = inject(QueryService);
  pokemonService = inject(PokemonService);
  teamService = inject(TeamService);
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);

  @Input() teamOptions!: TeamOptions;
  @Input() pokemons!: Pokemon[];
  @Output() addPokemonEvent = new EventEmitter<Pokemon>();
  @Output() calculateMaxLvlEvent = new EventEmitter();


  @ViewChild('pokemonInput') pokemonInputComponent!: SmartInputComponent;
  @ViewChild(PokemonComponent) pokemonPreviewComponent!: PokemonComponent;

  selectedPokemonIndex: number = 0;
  allAbilities: boolean = false;
  
  pokemonForm = this.formBuilder.group(
    {
      nickname: "",
      shiny: [false],
      gender: ["male"],
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

  async ngOnInit()
  {
    this.addEmptyPokemon();
    this.pokemonForm.controls.nickname.valueChanges.subscribe(async (value) => 
    {
      this.pokemons[this.selectedPokemonIndex].nickname = value ?? undefined;
    });

    this.pokemonForm.controls.shiny.valueChanges.subscribe(async (value) => 
    {
      this.pokemons[this.selectedPokemonIndex].shiny = value ?? false;
    });

    this.pokemonForm.controls.level.valueChanges.subscribe(async (value) => 
    {
      if(this.pokemonForm.controls.level.valid)
      {
        this.pokemons[this.selectedPokemonIndex].level = value ?? 50;
      }
    });

    this.pokemonForm.controls.gender.valueChanges.subscribe(async (value) => 
    {
      this.pokemons[this.selectedPokemonIndex].gender = value ?? undefined;
    });
    this.pokemonForm.controls.ivs.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        console.log("changing ivs", value)
        this.currentIVs = value;
        let ivs = this.pokemons[this.selectedPokemonIndex].ivs;
        ivs[this.selectedStat].value = value;
        this.pokemons[this.selectedPokemonIndex] = 
        { 
          ...this.pokemons[this.selectedPokemonIndex],
          ivs: ivs
        }
        this.calcIVSliderBackground(value, 0, 31);
      }
    });
    this.pokemonForm.controls.evs.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        this.currentEVs = value;
        this.pokemons[this.selectedPokemonIndex].evs![this.selectedStat].value = value
        this.calcEVSliderBackground(value, 0, this.currentMaxEVs);
        //this.forceChangePokemon();
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

  addEmptyPokemon()
  {
    this.pokemons.push(this.createEmptyPokemon());
  }

  selectPokemon(index: number)
  {
    this.selectedPokemonIndex = index;
    this.pokemons[this.selectedPokemonIndex] = this.pokemons[index];
    console.log("currently selected pokemon: ", this.pokemons[this.selectedPokemonIndex])
  }

  allAbilitiesSwitch() 
  { 
    this.allAbilities = !this.allAbilities;
    this.pokemons[this.selectedPokemonIndex].ability = undefined;
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
      this.pokemons[this.selectedPokemonIndex] = 
      { 
        ...this.pokemons[this.selectedPokemonIndex],
        name: event.name,
        dexNumber: data.dexNumber,
        types: data.types,
        sprite: data.sprite,
        evolutions: data.evolutions,
        preEvolution: data.preEvolution,
        stats: [...data.stats]
      }
      this.pokemonPreviewComponent.showStats[0] = true;
    }
    else
    {
      this.pokemons[this.selectedPokemonIndex] = 
      { 
        ...this.pokemons[this.selectedPokemonIndex],
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
    console.log("later pokemon in select event", this.pokemons[this.selectedPokemonIndex])
    //emit calculate max level event
    this.calculateMaxLvlEvent.emit();
  }

  async itemSelectEvent(event: Tag)
  {
    this.pokemons[this.selectedPokemonIndex].item = event ? await this.pokemonService.getItemByName(event.name) : undefined;
  }

  async abilitySelectEvent(event: Tag)
  {
    this.pokemons[this.selectedPokemonIndex] = { ...this.pokemons[this.selectedPokemonIndex], ability: event ? await this.pokemonService.getAbilityByName(event.name) : undefined }
  }

  async move1SelectEvent(event: Tag)
  {
    this.pokemons[this.selectedPokemonIndex].moves[0] = event ? await this.pokemonService.getMove(event.name) : undefined;
  }

  async move2SelectEvent(event: Tag)
  {
    this.pokemons[this.selectedPokemonIndex].moves[1] = event ? await this.pokemonService.getMove(event.name) : undefined
  }

  async move3SelectEvent(event: Tag)
  {
    this.pokemons[this.selectedPokemonIndex].moves[2] = event ? await this.pokemonService.getMove(event.name) : undefined
  }

  async move4SelectEvent(event: Tag)
  {
    this.pokemons[this.selectedPokemonIndex].moves[3] = event ? await this.pokemonService.getMove(event.name) : undefined
  }

  async natureSelectEvent(event: Tag)
  {
    this.pokemons[this.selectedPokemonIndex].nature = event ? await this.pokemonService.getNatureByName(event.name) : undefined;
  }

  async teraTypeSelectEvent(event: Tag)
  {
    this.pokemons[this.selectedPokemonIndex].teraType = event ? await this.pokemonService.getType(event.name, true) : undefined;
  }


  addPokemon()
  {
    this.addPokemonEvent.emit(this.pokemons[this.selectedPokemonIndex]);
    this.createEmptyPokemon();
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
      this.pokemonForm.controls.ivs.setValue(this.pokemons[this.selectedPokemonIndex].ivs![index].value);
      this.currentIVs = 0;
      this.pokemonForm.controls.evs.setValue(this.pokemons[this.selectedPokemonIndex].evs![index].value);
      this.currentEVs = 0;
      this.pokemonPreviewComponent.showStats[0] = true;
    }
  }

  createEmptyPokemon(): Pokemon
  {
    let pokemon: Pokemon = 
    {
      name: "",
      nickname: undefined,
      dexNumber: undefined,
      preEvolution: undefined,
      evolutions: [],
      types: undefined,
      teraType: undefined,
      item: undefined,
      ability: undefined,
      nature: undefined,
      moves: [undefined, undefined, undefined, undefined],
      stats: [],
      ivs:     
      [
        {
          name: "HP",
          identifier: "hp",
          value: 0
        },
        {
          name: "Atk",
          identifier: "attack",
          value: 0
        },
        {
          name: "Def",
          identifier: "defense",
          value: 0
        },
        {
          name: "SpA",
          identifier: "special-attack",
          value: 0
        },
        {
          name: "SpD",
          identifier: "special-defense",
          value: 0
        },
        {
          name: "Spe",
          identifier: "speed",
          value: 0
        }
      ],
      evs: 
      [
        {
          name: "HP",
          identifier: "hp",
          value: 0
        },
        {
          name: "Atk",
          identifier: "attack",
          value: 0
        },
        {
          name: "Def",
          identifier: "defense",
          value: 0
        },
        {
          name: "SpA",
          identifier: "special-attack",
          value: 0
        },
        {
          name: "SpD",
          identifier: "special-defense",
          value: 0
        },
        {
          name: "Spe",
          identifier: "speed",
          value: 0
        }
      ],
      level: 50,
      shiny: undefined,
      gender: "male",
      sprite: undefined,
    }
    return pokemon;
  }
}