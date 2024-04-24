import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { EditorData } from 'src/app/models/editorData.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
import { TopOptionComponent } from '../options/top-option/top-option.component';
import { TeamComponent } from '../team/team.component';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent 
{
  teamService = inject(TeamService);

  @Input() pokemons!: Pokemon[];
  @Output() outputTeam = new EventEmitter<Team>();
  @ViewChild(TeamComponent) teamComponent!: TeamComponent;
  @ViewChild(TopOptionComponent) topOptionComponent!: TopOptionComponent;

  editorData?: EditorData;
  editorOptions: EditorOptions = <EditorOptions>{};
  team: Team = <Team>{}
  posts: any;
  paste: string = '';

  async ngOnInit() 
  {
    this.editorData = await this.getEditorData();
    console.log("Editor data: ", this.editorData)
    this.getOptions();
    console.log("Editor options: ", this.editorOptions);
    
    this.team = 
    {
      id: '',
      pokemons: this.pokemons,
      options: this.editorOptions,
      player: this.topOptionComponent.detailsForm.controls.player.value != null ? this.topOptionComponent.detailsForm.controls.player.value : '',
      tournament: '',
      regulation: '',
      viewCount: 0,
      visibility: true,
      tags: this.topOptionComponent.tags
    }
    
    console.log("loaded team", this.team);
    this.topOptionComponent.detailsForm.valueChanges.subscribe((value) => 
    {
      console.log(value)
      this.team.player = value.player ?? undefined;
      this.team.tournament = value.tournament ?? undefined;
      this.team.regulation = value.regulation ?? undefined;
    });
    console.log("loaded team", this.team);
    this.topOptionComponent.tags$.subscribe((value) => 
    {
      console.log("TAgs",value)
      this.team.tags = value;
    });
  }

  ngOnChanges(changes: SimpleChanges)
  {
    //console.log("changes", changes)
    if(changes['pokemons'])
    {
      this.team.pokemons = changes['pokemons'].currentValue;
      this.calculateMaxLevel();
    }
    console.log(changes)
  }

  //Gets the maximun calculated stat value of all pokemons
  calculateMaxLevel()
  {
    this.editorOptions.maxLevel = this.teamComponent?.pokemonComponents ? 
      Math.max(...this.teamComponent?.pokemonComponents.map(s => s.calculatedStats?.total ? 
      Math.max(...s.calculatedStats?.total.map(v => v.value)) : 0)) : 0;
  }

  async generateTeam()
  {
    if(this.pokemons.length > 0 && this.pokemons.length <= 6)
    {
      console.log("Generating team: ", this.team);
      this.teamService.saveTeam(this.team).subscribe(
        {
          next: (response) =>
          {
            const w = window.open('', '_blank')!;
            w.document.write("<html><head></head><body>Please wait while we redirect you</body></html>");
            w.document.close();
            w.location = response;
          },
          error: (error) => 
          {
            console.log("Error generating team")
          }
        }
      )
      
    }
    else if(this.pokemons.length <= 0)
    {
      console.log("Error: no pokemons loaded")
    }
    else if(this.pokemons.length > 6)
    {
      console.log("Error: too many pokemons, limit is 6")
    }
    else
    {
      console.log("Error: paste not loaded, no pokemons to generate")
    }
  }

  updateTeam(option)
  {
    this.teamComponent.forceChange(this.editorOptions)
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
