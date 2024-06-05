import { Component, inject, Input, ViewChild } from '@angular/core';
import { PokemonData } from 'src/app/models/DTOs/pokemonData.dto';
import { EditorData } from 'src/app/models/editorData.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
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

  @Input() editorOptions!: EditorOptions;

  pokemon: Pokemon = <Pokemon>{};
  editorData?: EditorData;

  @ViewChild('pokemonInput') pokemonInputComponent!: SmartInputComponent;

  //input should have a selected anon obj
  async ngOnInit()
  {
    this.editorData = await this.getEditorData();
    console.log("Editor data: ", this.editorData)
    this.getOptions();
    console.log("Editor options: ", this.editorOptions);

    this.pokemon = 
    {
      name: "",

    }
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
    this.pokemon = structuredClone(this.pokemon);

    console.log(this.pokemon)
  }

  submit()
  {

  }

  getOptions()
  {
    this.editorOptions = 
    {
      shinyPath: this.editorData?.shinyPaths ? this.editorData?.shinyPaths[8] :       
      {
        name: "error",
        identifier: '0',
        path: "assets/error.png"
      },
      gender: true,
      malePath: this.editorData?.malePaths ? this.editorData?.malePaths[0] : 
      {
        name: "error",
        identifier: '0',
        path: "assets/error.png"
      },
      femalePath: this.editorData?.femalePaths ? this.editorData?.femalePaths[0] : 
      {
        name: "error",
        identifier: '0',
        path: "assets/error.png"
      },
      pokemonSpritesGen: this.editorData?.pokemonSpritesPaths ? 
      {
        name: this.editorData?.pokemonSpritesPaths[0].name,
        identifier: '0',
        path: this.editorData?.pokemonSpritesPaths[0].base!
      } :       
      {
        name: "error",
        identifier: '0',
        path: "assets/error.png"
      },
      typeIconsGen: "gen-ix",
      showIVs: true,
      showEVs: true,
      showNature: true,
      showDexNumber: true,
      showNickname: true,
      maxLevel: 0
    }
  }

  async getEditorData(): Promise<EditorData>
  {
    const data: EditorData = await this.teamService.getOptionsData();
    let editorData: EditorData = 
    {
      pokemonSpritesPaths: data.pokemonSpritesPaths,
      typeIconPaths: data.typeIconPaths,
      shinyPaths: data.shinyPaths,
      malePaths: data.malePaths,
      femalePaths: data.femalePaths
    }
    return editorData
  }

}

//pokemon x
//item x
//ability x
//moves x
//teratype
//shiny
//gender
//level
//ivs
//evs
//nature