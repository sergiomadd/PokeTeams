import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { GetPokemonService } from 'src/app/services/get-pokemon.service';
import { parsePaste } from 'src/app/services/parsePaste';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { EditorData } from 'src/app/models/editorData.model';
import { FormControl } from '@angular/forms';
import { SwitchComponent } from '../pieces/switch/switch.component';
import { Team } from 'src/app/models/team.model';
import { GenerateTeamService } from 'src/app/services/generate-team.service';
import { EditorOption } from 'src/app/models/editorOption.model';
import { TeamComponent } from '../team/team.component';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent 
{
  generateTeamService = inject(GenerateTeamService);

  @Input() pokemons!: Pokemon[];

  @Output() outputTeam = new EventEmitter<Team>();

  @ViewChild(TeamComponent) team!:TeamComponent;

  posts: any;
  paste: string = '';

  editorData!: EditorData;
  editorOptions!: EditorOptions;

  oldChanges = 
  {
    editorData: undefined
  }


  constructor()
  {

  }

  async ngOnInit() 
  {
    this.editorData = await this.getEditorData();
    console.log("Editor data: ", this.editorData)
    this.getOptions();
    console.log("Editor options: ", this.editorOptions);
  }

  async generateTeam()
  {
    let team: Team = 
    {
      pokemons: await this.pokemons,
      //settings: this.editorOptions
      //pokemons: "pokemons",
      settings: "options"
    }
    let teamLink: Promise<string> = this.generateTeamService.saveTeam(team);
    //open new tab with team link
    console.log("genearting ", team);
    console.log("generated: ", teamLink);
  }

  updateTeam(option)
  {
    this.team.forceChange(this.editorOptions)
  }


  getOptions()
  {
    this.editorOptions = 
    {
      shinyPath: this.editorData.shinyPaths ? this.editorData.shinyPaths[8] :       
      {
        name: "error",
        identifier: '0',
        path: "error"
      },
      gender: true,
      genderPath: this.editorData.genderPaths ? this.editorData.genderPaths[0] : 
      {
        name: "error",
        identifier: '0',
        path: "error"
      },
      pokemonSpritesGen: this.editorData.pokemonSpritesPaths ? 
      {
        name: this.editorData?.pokemonSpritesPaths[0].name,
        identifier: '0',
        path: this.editorData?.pokemonSpritesPaths[0].base!
      } :       
      {
        name: "error",
        identifier: '0',
        path: "error"
      },
      typeIconsGen: "gen-ix",
      showIVs: true,
      showEVs: true,
      showNature: true,
      showDexNumber: true,
      showNickname: true
    }
  }

  async getEditorData(): Promise<EditorData>
  {
    const data: EditorData = await this.generateTeamService.getOptionsData();
    let editorData: EditorData = 
    {
      pokemonSpritesPaths: data.pokemonSpritesPaths,
      typeIconPaths: data.typeIconPaths,
      shinyPaths: data.shinyPaths,
      genderPaths: data.genderPaths,
    }
    return editorData
  }
}
