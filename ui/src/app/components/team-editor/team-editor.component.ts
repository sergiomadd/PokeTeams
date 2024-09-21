import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { Tag } from 'src/app/models/tag.model';
import { Team } from 'src/app/models/team.model';
import { TeamOptions } from 'src/app/models/teamOptions.model';
import { UserPreview } from 'src/app/models/userPreview.model';
import { QueryService } from 'src/app/services/query.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { SmartInputComponent } from '../pieces/smart-input/smart-input.component';
import { TagEditorComponent } from '../pieces/tag-editor/tag-editor.component';
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
  router = inject(Router);
  queryService = inject(QueryService)

  @Input() pokemons!: Pokemon[];
  @Input() teamOptions!: TeamOptions;
  @Output() outputTeam = new EventEmitter<Team>();

  @ViewChild(TeamComponent) teamComponent!: TeamComponent;

  loggedUser$ = this.store.select(selectLoggedUser);
  team: Team = <Team>{}
  showTagEditor: boolean = true;

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
      options: this.teamOptions,
      player: undefined,
      tournament: undefined,
      regulation: undefined,
      viewCount: 0,
      visibility: true,
      tags: []
    }

    if(this.loggedUser$)
    {
      this.loggedUser$.subscribe
      (
        {
          next: (value) => 
          {
            if(value)
            {
              this.team.player = 
              {
                username: value.username,
                picture: value.picture
              }
            }
            else
            {
              this.team.player = this.buildAnonPlayer();
            }
          }
        }
      )
    }
  }

  buildAnonPlayer() : UserPreview
  {
    let anonPlayer: UserPreview =     
    {
      username: "",
      picture: "assets/anon.png"
    }
    return anonPlayer
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
            this.router.navigate(['/', response])
            /*
            console.log("response: ", response)
            const w = window.open('', '_blank')!;
            w.document.write("<html><head></head><body>Please wait while we redirect you</body></html>");
            w.location.pathname = response;
            w.document.close();
            if(true)
            {

            }
            else
            {
              console.log("Window popup blocked")
              this.router.navigate(['/', response])
            }
            */
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

  playerUpdateEvent(event: string)
  {
    if(this.team.player)
    {
      this.team.player.username = event;
    }
  }

  async tournamentSelectEvent(event: Tag)
  {
    this.team.tournament = event ? await this.teamService.getTournamentByName(event.name) : undefined;
    if(!this.team.tournament)
    {
      this.team.tournament = 
      {
        name: event.name,
        official: false
      }
    }
  }

  async regulationSelectEvent(event: Tag)
  {
    this.team.regulation = event ? await this.teamService.getRegulationByIdentifier(event.identifier) : undefined;
  }

  @ViewChild(TagEditorComponent) tagEditorComponent!: TagEditorComponent;
  @ViewChild("tagInput") tagSmartInput!: SmartInputComponent;
  toggleTagEditor()
  {
    if(this.showTagEditor) { this.tagEditorCloseEvent(); }
    else { this.showTagEditor = true; }
    if(this.showTagEditor)
    {
      this.tagEditorComponent.setName(this.tagSmartInput.input.nativeElement.value)
    }
  }

  tagSelectEvent(tag: Tag)
  {
    if(this.team.tags)
    {
      this.team.tags = [...this.team.tags, tag];
    }
    else
    {
      this.team.tags = [tag];
    }
  }

  tagAddEvent(tag: Tag)
  {
    if(this.team.tags)
    {
      this.team.tags = [...this.team.tags, tag];
    }
    else
    {
      this.team.tags = [tag];
    }
  }

  tagEditorCloseEvent()
  {
    if(this.tagEditorComponent.colorPickerOpen)
    {
      this.tagEditorComponent.colorPickerOpen = false;
      //Wait for color picker transition to finish
      setTimeout(() => {  this.showTagEditor = false; }, 400);
    }
    else
    {
      this.showTagEditor = false;
    }
  }

  updateTeam(option)
  {
    this.teamComponent.forceChange(this.teamOptions)
  }

  //Gets the maximun calculated stat value of all pokemons
  calculateMaxLevel()
  {
    this.teamOptions.maxLevel = this.teamComponent?.pokemonComponents ? 
      Math.max(...this.teamComponent?.pokemonComponents.map(s => s.calculatedStats?.total ? 
      Math.max(...s.calculatedStats?.total.map(v => v.value)) : 0)) : 0;
  }
}
