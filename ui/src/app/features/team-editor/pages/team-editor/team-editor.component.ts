import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
import { QueryService } from 'src/app/features/search/services/query.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { Team } from 'src/app/features/team/models/team.model';
import { Tournament } from 'src/app/features/team/models/tournament.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { UserPreview } from 'src/app/features/user/models/userPreview.model';
import { UserService } from 'src/app/features/user/services/user.service';
import { SmartInputComponent } from '../../../../shared/components/smart-input/smart-input.component';
import { TagEditorComponent } from '../../../team/components/tag-editor/tag-editor.component';
import { TeamComponent } from '../../../team/components/team/team.component';
import { TeamEditorService } from '../../services/team-editor.service';

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
  queryService = inject(QueryService);
  teamEditorService = inject(TeamEditorService);

  @Output() outputTeam = new EventEmitter<Team>();

  @ViewChild(TeamComponent) teamComponent!: TeamComponent;

  loggedUser$ = this.store.select(selectLoggedUser);
  team: Team = <Team>{};
  showTournamentEditor: boolean = false;
  showTagEditor: boolean = false;
  tagAlreadyAdded: boolean = false;

  async ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    })
  }

  async ngAfterContentInit()
  {
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
      username: "anon",
      picture: "assets/anon.png"
    }
    return anonPlayer
  }

  async generateTeam()
  {
    if(this.team.pokemons.length > 0 
      && this.team.pokemons.length <= 6 
      //If dexNumber is undefined -> empty pokemon
      && this.team.pokemons.some(p => p.dexNumber))
    {
      console.log("Generating team: ", this.team);
      this.teamService.saveTeam(this.team).subscribe(
        {
          next: (response) =>
          {
            this.router.navigate(['/', response])
            
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
            
          },
          error: (error) => 
          {
            console.log("Error generating team")
          }
        }
      )
    }
    else if(this.team.pokemons.length <= 0)
    {
      console.log("Error: no pokemons loaded")
    }
    else if(this.team.pokemons.length > 6)
    {
      console.log("Error: too many pokemons, limit is 6")
    }
    else if(this.team.pokemons.some(p => !p.dexNumber))
    {
      console.log("Error: there are empty pokemons")
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

  tagLabel: string = `Tags (${this.team?.tags ? this.team?.tags?.length : 0}/3)`;

  tagSelectEvent(tag: Tag)
  {
    this.tagAlreadyAdded = false;
    if(this.team.tags)
    {
      if(this.team.tags.length < 3 && !this.team.tags.some(t => t.identifier == tag.identifier))
      {
        this.team.tags = [...this.team.tags, tag];
        if(this.team.tags.length === 3)
        {
          this.disableTagSelector();
        }
        this.tagLabel = `Tags (${this.team?.tags ? this.team?.tags?.length : 0}/3)`;
      }
      else if(this.team.tags.some(t => t.identifier == tag.identifier))
      {
        this.tagAlreadyAdded = true;
      }
    }
    else
    {
      this.team.tags = [tag];
    }
  }

  enableTagSelector()
  {
    this.tagSmartInput.searchForm.controls.key.enable();
    this.tagSmartInput.disabled = false;
  }

  disableTagSelector()
  {
    this.tagEditorCloseEvent();
    this.tagSmartInput.searchForm.controls.key.disable();
    this.tagSmartInput.disabled = true;
  }

  removeTag()
  {
    this.enableTagSelector();
    this.tagLabel = `Tags (${this.team?.tags ? this.team?.tags?.length : 0}/3)`;
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
    this.teamComponent.forceChange(this.team.options)
  }
  
  toggleTournamentEditor()
  {
    this.showTournamentEditor = !this.showTournamentEditor;
  }

  tournamentAddEvent(tournament: Tournament)
  {
    this.team.tournament = tournament;
  }

  tournamentEditorCloseEvent()
  {
    this.showTournamentEditor = false;
  }

  showEVsCheckEvent($event: boolean)
  {
    this.team.options.showEVs = $event;
  }

  showIVsCheckEvent($event: boolean)
  {
    this.team.options.showIVs = $event;
  }

  showNatureCheckEvent($event: boolean)
  {
    this.team.options.showNature = $event;
  }

  showDexNumberCheckEvent($event: boolean)
  {
    this.team.options.showDexNumber = $event;
  }

  showNicknameCheckEvent($event: boolean)
  {
    this.team.options.showNickname = $event;
  }
}
