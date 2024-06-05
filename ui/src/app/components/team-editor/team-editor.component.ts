import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { EditorData } from 'src/app/models/editorData.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { Tag } from 'src/app/models/tag.model';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { TopOptionComponent } from '../options/top-option/top-option.component';
import { SmartInputComponent } from '../pieces/smart-input/smart-input.component';
import { TeamComponent } from '../team/team.component';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent 
{
  teamService = inject(TeamService);
  userService = inject(UserService);

  @Input() pokemons!: Pokemon[];
  @Input() editorOptions!: EditorOptions;
  @Input() editorData?: EditorData;

  @Output() outputTeam = new EventEmitter<Team>();
  @ViewChild(TeamComponent) teamComponent!: TeamComponent;
  @ViewChild(TopOptionComponent) topOptionComponent!: TopOptionComponent;

  team: Team = <Team>{}
  posts: any;
  paste: string = '';

  customQueryResult: Tag = 
  {
    name: "Custom value",
    identifier: "custom"
  }

  //getters for childs
  @ViewChild('userInput') userInputComponent!: SmartInputComponent;
  queryUserCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.userService.queryUser(args)).map((u): Tag => 
      ({
        name: u.username,
        identifier: u.username,
        icon: u.picture
      })).concat([this.customQueryResult]);
  }

  @ViewChild('tournamentInput') tournamentInputComponent!: SmartInputComponent;
  queryTournamentCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.teamService.queryTournamentsByName(args)).map(t => 
      ({
        name: t.name,
        identifier: t.identifier,
        icon: t.icon
      }));
  }

  @ViewChild('regulationInput') regulationInputComponent!: SmartInputComponent;
  queryRegulationCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.teamService.getAllRegulations())
      .filter(r => 
      {
        return r.name.toLowerCase().includes(args.toLowerCase())
      })
      .map(r =>({
        name: r.name,
        identifier: r.identifier
      }));
  }
  regulationAllCallback = async (): Promise<Tag[]> => 
  {
    return (await this.teamService.getAllRegulations()).map(r => 
      ({
        name: r.name,
        identifier: r.identifier
      }));
  }

  async ngOnInit() 
  {

  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['editorOptions'])
    {
      this.team.options = changes['editorOptions'].currentValue;
    }
    if(changes['pokemons'])
    {
      this.team.pokemons = changes['pokemons'].currentValue;
      this.calculateMaxLevel();
    }
  }

  async ngAfterContentInit()
  {
    this.team = 
    {
      id: '',
      pokemons: this.pokemons,
      options: this.editorOptions,
      //player: this.topOptionComponent.detailsForm.controls.player.value != null ? this.topOptionComponent.detailsForm.controls.player.value : '',
      //player: this.userInputComponent.result?.name ?? '',
      tournament: '',
      regulation: '',
      viewCount: 0,
      visibility: true,
      tags: this.topOptionComponent?.tags
    }
    //this.userInputComponent.
    
    this.topOptionComponent?.detailsForm.valueChanges.subscribe((value) => 
    {
      console.log(value)
      this.team.player = value.player ?? undefined;
      this.team.tournament = value.tournament ?? undefined;
      this.team.regulation = value.regulation ?? undefined;
    });
    this.topOptionComponent?.tags$.subscribe((value) => 
    {
      console.log("TAgs",value)
      this.team.tags = value;
    });
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
}
