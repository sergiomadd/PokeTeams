import { Component, inject, Input, ViewChild } from '@angular/core';
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
import { SmartInputComponent } from '../pieces/smart-input/smart-input.component';

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

  @Input() editorOptions!: EditorOptions;

  pokemon: Pokemon = <Pokemon>{};
  editorData?: EditorData;

  @ViewChild('pokemonInput') pokemonInputComponent!: SmartInputComponent;
  
  pokemonForm = this.formBuilder.group(
    {
      shiny: [false],
      gender: [""],
      level: [50, [Validators.min(1), Validators.max(100)]],
      ivs: [0],
      evs: [0]
    });

  //input should have a pre-selected anon obj
  async ngOnInit()
  {
    //Init empty pokemon
    let emptyStat: Stat =
    {
      name: "",
      identifier: "",
      value: 0
    }

    this.pokemon = 
    {
      name: "",
      moves: [],
      ivs: [emptyStat,emptyStat,emptyStat,emptyStat,emptyStat,emptyStat],
      evs: [emptyStat,emptyStat,emptyStat,emptyStat,emptyStat,emptyStat],
      level: 50
    }

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
    });
    this.pokemonForm.controls.evs.valueChanges.subscribe(async (value) => 
    {
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
    console.log(this.pokemon)
  }

  submit()
  {

  }
}