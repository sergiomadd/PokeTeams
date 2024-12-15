import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoggedUserService } from 'src/app/core/auth/services/logged-user.service';
import { selectAccessToken } from 'src/app/core/auth/store/auth.selectors';
import { selectTheme } from 'src/app/core/config/store/config.selectors';
import { Tag } from 'src/app/features/team/models/tag.model';
import { Team } from 'src/app/features/team/models/team.model';
import { Tournament } from 'src/app/features/team/models/tournament.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { UserPreview } from 'src/app/features/user/models/userPreview.model';
import { UserService } from 'src/app/features/user/services/user.service';
import { QueryService } from 'src/app/shared/services/query.service';
import { SmartInputComponent } from '../../../../shared/components/smart-input/smart-input.component';
import { TeamEditorService } from '../../services/team-editor.service';
import { TagEditorComponent } from '../tag-editor/tag-editor.component';
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
  queryService = inject(QueryService);
  teamEditorService = inject(TeamEditorService);
  loggedUserService = inject(LoggedUserService);

  @ViewChild(TeamComponent) teamComponent!: TeamComponent;

  accessToken$: Observable<string | null> = this.store.select(selectAccessToken);
  loggedUserTag?: Tag;

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  team: Team = <Team>{};
  showTournamentEditor: boolean = false;
  showTagEditor: boolean = false;
  tagAlreadyAdded: boolean = false;
  feedback?: string;

  async ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    });
    this.loggedUserService.loggedUser.subscribe(async value => 
      {
        if(value)
        {
          this.loggedUserTag = 
          {
            identifier: value.username,
            name: value.username,
            icon: value.picture
          };
          this.team.player = 
          {
            username: value.username,
            picture: value.picture
          };
        }
        else
        {
          this.loggedUserTag = undefined;
          this.team.player = undefined;
        }
      })
  }

  ngOnDestroy()
  {
    this.reset();
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

  reset()
  {
    this.teamEditorService.setEmptyTeam();
  }

  playerUpdateEvent(event: string)
  {
    this.team.player = 
    {
      username: event,
      picture: this.selectedThemeName === 'light' ? "assets/anon.png" : "assets/anon-white.png"
    };
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
    this.feedback = undefined;
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
        this.feedback = "Tag already added";
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

  showNicknameCheckEvent($event: boolean)
  {
    this.team.options.showNickname = $event;
  }


}
