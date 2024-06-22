import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PokemonData } from 'src/app/models/DTOs/pokemonData.dto';
import { EditorData } from 'src/app/models/editorData.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { Stat } from 'src/app/models/pokemon/stat.model';
import { Tag } from 'src/app/models/tag.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { QueryService } from 'src/app/services/query.service';
import { TeamService } from 'src/app/services/team.service';
import { UtilService } from 'src/app/services/util.service';
import { SmartInputComponent } from '../pieces/smart-input/smart-input.component';
import { PokemonComponent } from '../pokemon/pokemon.component';

@Component({
  selector: 'app-pokemon-creator',
  templateUrl: './pokemon-creator.component.html',
  styleUrl: './pokemon-creator.component.scss'
})
export class PokemonCreatorComponent 
{
  queryService = inject(QueryService);
  pokemonService = inject(PokemonService);
  teamService = inject(TeamService);
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);

  @Input() editorOptions!: EditorOptions;
  @Output() addPokemonEvent = new EventEmitter<Pokemon>();

  @ViewChild('pokemonInput') pokemonInputComponent!: SmartInputComponent;
  @ViewChild(PokemonComponent) pokemonPreviewComponent!: PokemonComponent;

  pokemon: Pokemon = <Pokemon>{};
  editorData?: EditorData;
  allAbilities: boolean = false;

  allAbilitiesSwitch() 
  { 
    this.allAbilities = !this.allAbilities;
    this.pokemon.ability = undefined;
  }
  
  pokemonForm = this.formBuilder.group(
    {
      shiny: [false],
      gender: [""],
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

  async ngOnInit()
  {
    this.createEmptyPokemon();

    this.pokemonForm.controls.shiny.valueChanges.subscribe(async (value) => 
    {
      this.pokemon.shiny = value ?? false;
    });

    this.pokemonForm.controls.level.valueChanges.subscribe(async (value) => 
    {
      if(this.pokemonForm.controls.level.valid)
      {
        this.pokemon.level = value ?? 50;
      }
    });

    this.pokemonForm.controls.gender.valueChanges.subscribe(async (value) => 
    {
      this.pokemon.gender = value ?? undefined;
    });
    this.pokemonForm.controls.ivs.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        this.currentIVs = value;
        this.pokemon.ivs![this.selectedStat].value = value
        this.forceChangePokemon();
      }
    });
    this.pokemonForm.controls.evs.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        this.currentEVs = value;
        this.pokemon.evs![this.selectedStat].value = value
        this.forceChangePokemon();
      }
    });
  }

  async pokemonSelectEvent(event: Tag)
  {
    const data: PokemonData = await this.pokemonService.getPokemon(event.name);

    this.pokemon.name = event.name;
    this.pokemon.dexNumber = data.dexNumber;
    this.pokemon.types = data.types;
    this.pokemon.sprites = data.sprites;
    this.pokemon.evolutions = data.evolutions;
    this.pokemon.preEvolution = data.preEvolution;
    this.pokemon.stats = data.stats;
    this.forceChangePokemon();
    this.pokemonPreviewComponent.showStats[0] = true;
  }
  async pokemonRemoveSelectedEvent(event: Tag)
  {
    this.pokemon.name = undefined;
    this.pokemon.dexNumber = undefined;
    this.pokemon.types = undefined;
    this.pokemon.sprites = undefined;
    this.pokemon.evolutions = undefined;
    this.pokemon.preEvolution = undefined;
    this.pokemon.stats = undefined;
    this.forceChangePokemon();
  }

  async itemSelectEvent(event: Tag)
  {
    this.pokemon.item = await this.pokemonService.getItemByName(event.name);
    this.forceChangePokemon();
  }
  async itemRemoveSelectedEvent(event: Tag)
  {
    this.pokemon.item = undefined;
    this.forceChangePokemon();
  }

  async abilitySelectEvent(event: Tag)
  {
    this.pokemon.ability = await this.pokemonService.getAbilityByName(event.name);
    this.forceChangePokemon();
  }
  async abilityRemoveSelectedEvent(event: Tag)
  {
    this.pokemon.ability = undefined;
    this.forceChangePokemon();
  }

  async move1SelectEvent(event: Tag)
  {
    this.pokemon.moves![0] = await this.pokemonService.getMove(event.name);
    this.forceChangePokemon();
  }
  async move1RemoveSelectedEvent(event: Tag)
  {
    this.pokemon.moves![0] = undefined;
    this.forceChangePokemon();
  }

  async move2SelectEvent(event: Tag)
  {
    this.pokemon.moves![1] = await this.pokemonService.getMove(event.name);
    this.forceChangePokemon();
  }
  async move2RemoveSelectedEvent(event: Tag)
  {
    this.pokemon.moves![1] = undefined;
    this.forceChangePokemon();
  }

  async move3SelectEvent(event: Tag)
  {
    this.pokemon.moves![2] = await this.pokemonService.getMove(event.name);
    this.forceChangePokemon();
  }
  async move3RemoveSelectedEvent(event: Tag)
  {
    this.pokemon.moves![2] = undefined;
    this.forceChangePokemon();
  }

  async move4SelectEvent(event: Tag)
  {
    this.pokemon.moves![3] = await this.pokemonService.getMove(event.name);
    this.forceChangePokemon();
  }
  async move4RemoveSelectedEvent(event: Tag)
  {
    this.pokemon.moves![3] = undefined;
    this.forceChangePokemon();
  }

  async natureSelectEvent(event: Tag)
  {
    this.pokemon.nature = await this.pokemonService.getNatureByName(event.name);
    this.forceChangePokemon();
  }
  async natureRemoveSelectedEvent(event: Tag)
  {
    this.pokemon.nature = undefined;
    this.forceChangePokemon();
  }

  async teraTypeSelectEvent(event: Tag)
  {
    this.pokemon.teraType = await this.pokemonService.getType(event.name, true);
    this.forceChangePokemon();
  }
  async teraTypeRemoveSelectedEvent(event: Tag)
  {
    this.pokemon.teraType = undefined;
    this.forceChangePokemon();
  }

  forceChangePokemon()
  {
    this.pokemon = structuredClone(this.pokemon);
  }

  addPokemon()
  {
    this.addPokemonEvent.emit(this.pokemon);
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
      this.pokemonForm.controls.ivs.setValue(this.pokemon.ivs![index].value);
      this.currentIVs = 0;
      this.pokemonForm.controls.evs.setValue(this.pokemon.evs![index].value);
      this.currentEVs = 0;
      this.pokemonPreviewComponent.showStats[0] = true;
    }
  }

  createEmptyPokemon()
  {
    this.pokemon;
    this.pokemon = 
    {
      name: "",
      nickname: undefined,
      dexNumber: undefined,
      preEvolution: undefined,
      evolutions: undefined,
      types: undefined,
      teraType: undefined,
      item: undefined,
      ability: undefined,
      nature: undefined,
      moves: [],
      stats: undefined,
      ivs: undefined,
      evs: undefined,
      level: 50,
      shiny: undefined,
      gender: undefined,
      sprites: undefined,
    }

    this.pokemon.ivs = 
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
    ];
    this.pokemon.evs = 
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
    ];
  }
}