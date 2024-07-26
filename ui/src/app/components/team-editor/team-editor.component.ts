import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { Tag } from 'src/app/models/tag.model';
import { Team } from 'src/app/models/team.model';
import { TeamOptions } from 'src/app/models/teamOptions.model';
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
  store = inject(Store);

  @Input() pokemons!: Pokemon[];
  @Input() teamOptions!: TeamOptions;
  @Output() outputTeam = new EventEmitter<Team>();

  @ViewChild(TeamComponent) teamComponent!: TeamComponent;
  @ViewChild(TopOptionComponent) topOptionComponent!: TopOptionComponent;

  loggedUser$ = this.store.select(selectLoggedUser);
  team: Team = <Team>{}
  posts: any;
  paste: string = '';
  logged: boolean = true;

  //getters for childs
  @ViewChild('userInput') userInputComponent!: SmartInputComponent;
  queryUserCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.userService.queryUser(args)).map((u): Tag => 
      ({
        name: u.username,
        identifier: u.username,
        icon: u.picture
      }));
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

  playerUpdateEvent(event: string)
  {
    this.team.player = event;
  }

  tournamentSelectEvent(event: Tag)
  {
    console.log("selectiing")
    this.team.tournament = event ? event.name : undefined;
  }

  regulationSelectEvent(event: Tag)
  {
    this.team.regulation = event ? event.identifier : undefined;
  }

  tagSelectEvent(event: Tag)
  {
    //this.team.player = event ? event.name : undefined;
  }

  async ngOnInit() 
  {
    if(this.loggedUser$)
    {
      this.loggedUser$.subscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['editorOptions'])
    {
      this.team.options = changes['editorOptions'].currentValue;
    }
    if(changes['pokemons'])
    {
      console.log("pokemon changes in team editor")
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
      options: this.teamOptions,
      player: "",
      tournament: "",
      regulation: "",
      viewCount: 0,
      visibility: true,
      tags: this.topOptionComponent?.tags
    }
    /*
    this.topOptionComponent?.tags$.subscribe((value) => 
    {
      console.log("TAgs",value)
      this.team.tags = value;
    });
    */
  }

  //Gets the maximun calculated stat value of all pokemons
  calculateMaxLevel()
  {
    console.log("calculating max level")
    this.teamOptions.maxLevel = this.teamComponent?.pokemonComponents ? 
      Math.max(...this.teamComponent?.pokemonComponents.map(s => s.calculatedStats?.total ? 
      Math.max(...s.calculatedStats?.total.map(v => v.value)) : 0)) : 0;
  }

  async generateTeam()
  {
    if(this.pokemons.length > 0 && this.pokemons.length <= 6)
    {
      console.log("Generating team: ", this.team);
      /*
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
      */
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
    this.teamComponent.forceChange(this.teamOptions)
  }


}
