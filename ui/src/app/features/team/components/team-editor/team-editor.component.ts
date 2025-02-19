import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { selectLoggedUser } from 'src/app/core/auth/store/auth.selectors';
import { FeedbackColors } from 'src/app/core/config/models/colors';
import { selectTheme } from 'src/app/core/config/store/config.selectors';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { Team } from 'src/app/features/team/models/team.model';
import { Tournament } from 'src/app/features/team/models/tournament.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { QueryItem } from 'src/app/shared/models/queryResult.model';
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
  translateSergice = inject(TranslateService);
  window = inject(WindowService);

  @ViewChild(TeamComponent) teamComponent!: TeamComponent;

  loggedUser$ = this.store.select(selectLoggedUser);
  loggedUser?: QueryItem;

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  team: Team = <Team>{};
  showTournamentEditor: boolean = false;
  showTagEditor: boolean = false;
  tagAlreadyAdded: boolean = false;
  feedback?: string;
  readonly feedbackColors = FeedbackColors;

  async ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    });
    this.loggedUser$.subscribe(async value => 
      {
        if(value)
        {
          this.loggedUser = 
          {
            identifier: value.username,
            name: value.username,
            icon: value.picture
          };
          this.team.player = 
          {
            username: value.username,
            picture: value.picture,
            registered: true
          };
        }
        else
        {
          this.loggedUser = undefined;
          this.team.player = undefined;
        }
      })
  }

  ngOnDestroy()
  {
    this.reset();
  }

  reset()
  {
    this.teamEditorService.setEmptyTeam();
  }

  playerUpdateEvent(event: string)
  {
    if(event)
    {
      this.team.player = 
      {
        username: event,
        picture: undefined,
        registered: false
      };
    }
    else
    {
      this.team.player = undefined;
    }
  }

  async tournamentSelectEvent(event: QueryItem)
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

  async regulationSelectEvent(event: QueryItem)
  {
    this.team.regulation = event ? await this.teamService.getRegulationByIdentifier(event.identifier) : undefined;
  }

  async rentalCodeSelectEvent(event: string)
  {
    this.team.rentalCode = event ?? undefined;
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

  currentTags: number = this.team?.tags ? this.team?.tags?.length : 0;
  maxTags: number = 3;

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
        this.currentTags = this.team?.tags ? this.team?.tags?.length : 0;
      }
      else if(this.team.tags.some(t => t.identifier == tag.identifier))
      {
        this.feedback = this.translateSergice.instant("tag_input-feedback");
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
    this.currentTags = this.team?.tags ? this.team?.tags?.length : 0;
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

  showIVsCheckEvent($event: boolean)
  {
    this.team.options.ivsVisibility = $event;
    this.team = {...this.team}
  }

  showEVsCheckEvent($event: boolean)
  {
    this.team.options.evsVisibility = $event;
    this.team = {...this.team}
  }

  showNatureCheckEvent($event: boolean)
  {
    this.team.options.naturesVisibility = $event; 
    this.team = {...this.team}
  }
}
