import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ThemeService } from 'src/app/core/helpers/theme.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { FeedbackColors } from 'src/app/core/models/misc/colors';
import { QueryItem } from 'src/app/core/models/misc/queryResult.model';
import { Tag } from 'src/app/core/models/team/tag.model';
import { Team } from 'src/app/core/models/team/team.model';
import { Tournament } from 'src/app/core/models/team/tournament.model';
import { QueryService } from 'src/app/core/services/query.service';
import { TeamService } from 'src/app/core/services/team.service';
import { UserService } from 'src/app/core/services/user.service';
import { selectLoggedUser } from 'src/app/core/store/auth/auth.selectors';
import { selectTheme } from 'src/app/core/store/config/config.selectors';
import { User } from 'src/app/features/user/models/user.model';
import { TeamEditorService } from 'src/app/shared/services/team-editor.service';
import { TagEditorComponent } from '../../dumb/tag-editor/tag-editor.component';
import { SmartInputComponent } from '../../smart-input/smart-input.component';
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
  formBuilder = inject(FormBuilder);
  theme = inject(ThemeService);

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
  teamPrivateFeedback: boolean = false;
  readonly feedbackColors = FeedbackColors;
  playerError?: string;
  rentalCodeError?: string;
  titleError?: string;

  @ViewChild('playerInput') playerInput?: SmartInputComponent;

  async ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
      if(this.teamComponent)
      {
        this.teamComponent.showAllStats = false;
        this.teamComponent.showAllNotes = false;
      }
    });
    this.loggedUser$.subscribe(async (value: User | null) => 
      {
        if(value)
        {
          this.loggedUser = 
          {
            identifier: value.name ?? value.username,
            name: value.username,
            icon: value.picture
          };
          this.team.user = 
          {
            username: value.username,
            picture: value.picture,
            registered: true
          };
        }
        else
        {
          this.loggedUser = undefined;
          this.team.user = undefined;
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
      this.playerError = this.teamEditorService.validatePlayer(event);
      if(!this.playerError)
      {
        this.team.player = 
        {
          username: event,
          picture: undefined,
          registered: false
        };
        this.teamComponent.checkUserToPlayer();
        return;
      }
    }
    else
    {
      this.team.player = undefined
    }
  }

  titleUpdateEvent(event: string)
  {
    if(event)
    {
      this.titleError = this.teamEditorService.validateTitle(event);
      if(!this.titleError)
      {
        this.team.title = event;
        return;
      }
    }
    else
    {
      this.team.title = undefined
    }
  }

  matchUserToPlayer()
  {
    if(this.loggedUser && this.team.user)
    {
      this.team.player = this.team.user;
      this.teamComponent.checkUserToPlayer();
      if(this.playerInput && this.team.user.username)
      {
        this.playerInput.setInputValue(this.team.user.username)
      }
    }
  }

  async tournamentSelectEvent(event: QueryItem)
  {
    this.team.tournament = event ? await this.teamService.getTournamentByIdentifier(event.identifier) : undefined;
  }

  async regulationSelectEvent(event: QueryItem)
  {
    this.team.regulation = event ? await this.teamService.getRegulationByIdentifier(event.identifier) : undefined;
  }

  rentalCodeSelectEvent(event: string)
  {
    this.rentalCodeError = this.teamEditorService.validateRentalCode(event);
    if(event)
    {
      this.team.rentalCode = event 
    }
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

  async tagSelectEvent(queryItem: QueryItem)
  {
    this.feedback = undefined;
    let tag: Tag = await this.teamService.getTagByIdentifier(queryItem.identifier);
    if(this.team.tags && tag)
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
        this.feedback = this.translateSergice.instant("team.editor.tag_input-feedback");
      }
    }
  }

  tagAddNewEvent(tag: Tag)
  {
    this.feedback = undefined;
    if(this.team.tags && tag)
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
        this.feedback = this.translateSergice.instant("team.editor.tag_input-feedback");
      }
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
  
  //For custom tournaments maybe in future
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

  //Privacy

  showIVsCheckEvent($event: boolean)
  {
    if(this.team.visibility)
    {
      this.team.options.ivsVisibility = $event;
      this.team = {...this.team}
    }
    else
    {
      this.teamPrivateFeedback = true;
    }
  }

  showEVsCheckEvent($event: boolean)
  {
    if(this.team.visibility)
    {
      this.team.options.evsVisibility = $event;
      this.team = {...this.team}
    }
    else
    {
      this.teamPrivateFeedback = true;
    }
  }

  showNatureCheckEvent($event: boolean)
  {
    if(this.team.visibility)
    {
      this.team.options.naturesVisibility = $event; 
      this.team = {...this.team}
    }
    else
    {
      this.teamPrivateFeedback = true;
    }
  }

  teamVisibiltyCheckEvent($event: boolean)
  {
    this.team.visibility = $event; 
    if(!this.team.visibility)
    {
      this.team.options.ivsVisibility = false;
      this.team.options.evsVisibility = false;
      this.team.options.naturesVisibility = false; 
    }
    else
    {
      this.teamPrivateFeedback = false;
    }
    this.team = {...this.team}
  }
}
