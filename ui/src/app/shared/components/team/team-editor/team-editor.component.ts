import { Component, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { FeedbackColors } from '../../../../core/models/misc/colors';
import { QueryItem } from '../../../../core/models/misc/queryResult.model';
import { Tag } from '../../../../core/models/team/tag.model';
import { Team } from '../../../../core/models/team/team.model';
import { QueryService } from '../../../../core/services/query.service';
import { TeamService } from '../../../../core/services/team.service';
import { UserService } from '../../../../core/services/user.service';
import { selectLoggedUser } from '../../../../core/store/auth/auth.selectors';
import { selectTheme } from '../../../../core/store/config/config.selectors';
import { User } from '../../../../features/user/models/user.model';
import { TeamEditorService } from '../../../services/team-editor.service';
import { TagEditorComponent } from '../../dumb/tag-editor/tag-editor.component';
import { SmartInputComponent } from '../../smart-input/smart-input.component';
import { TeamComponent } from '../team/team.component';

@Component({
    selector: 'app-team-editor',
    templateUrl: './team-editor.component.html',
    styleUrls: ['./team-editor.component.scss'],
    standalone: false
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
  util = inject(UtilService);

  @ViewChild(TeamComponent) teamComponent!: TeamComponent;

  loggedUser$ = this.store.select(selectLoggedUser);
  loggedUser?: QueryItem;

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  teamFormSubmitted: boolean = false;
  teamForm = this.formBuilder.group(
    {
      player: ["", [Validators.maxLength(32)]],
      rental: ["", [Validators.maxLength(32)]],
      title: ["", [Validators.maxLength(128)]],
    });

  team: Team = <Team>{};
  currentTags: number = 0;
  maxTags: number = 3;
  disableTagInput: boolean = false;
  showTagEditor: boolean = false;
  tagAlreadyAdded: boolean = false;
  feedback?: string;
  teamPrivateFeedback: boolean = false;
  exampleTeamModified?: boolean = undefined;
  readonly feedbackColors = FeedbackColors;

  @ViewChild('playerInput') playerInput?: SmartInputComponent;

  async ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
      this.currentTags = value.tags?.length ?? 0;
      this.disableTagInput = this.currentTags >= this.maxTags ? true : false;
      if(this.teamComponent)
      {
        this.teamComponent.showAllStats = false;
        this.teamComponent.showAllNotes = false;
      }
      if(this.loggedUser && this.team.user == null)
      {
        this.team.user = 
        {
          username: this.loggedUser.name,
          picture: this.loggedUser.icon,
          registered: true
        };
      }
      if(this.team.id === "example")
      {
        this.teamEditorService.setExampleTeamModified(false);
      }
      else
      {
        this.teamEditorService.setExampleTeamModified(undefined);
      }
    });
    //If the example paste team is modified, save it as a new team
    this.teamEditorService.exampleTeamModified$.subscribe((value) => 
    {
      this.exampleTeamModified = value;
      if(value && this.team && this.team.id)
      {
        this.team.id = "";
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
    this.teamForm.controls.player.valueChanges.subscribe(value =>
    {
      if(value)
      {
        if(value.length <= 32)
        {
          this.team.player = 
          {
            username: value,
            picture: undefined,
            registered: false
          };
          this.teamComponent.checkUserToPlayer();
          this.teamEditorService.setExampleTeamModified(true);
          return;
        }
      }
      else
      {
        this.team.player = undefined
        this.teamEditorService.setExampleTeamModified(false); 
      }
    })
    this.teamForm.controls.rental.valueChanges.subscribe(value =>
    {
      if(value)
      {
        if(value.length <= 32)
        {
          this.team.rentalCode = value 
          this.teamEditorService.setExampleTeamModified(true);
        }
      }
      else
      {
        this.team.rentalCode = undefined;
        this.teamEditorService.setExampleTeamModified(false); 
      }
    })
    this.teamForm.controls.title.valueChanges.subscribe(value =>
    {
      this.teamEditorService.setExampleTeamModified(true);
      if(value)
      {
        if(value.length <= 128)
        {
          this.team.title = value;
          return;
        }
      }
      else
      {
        this.team.title = undefined
      }
    })
  }

  ngOnChanges()
  {

  }

  ngOnDestroy()
  {
    this.reset();
  }

  reset()
  {
    this.teamEditorService.setEmptyTeam();
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
    if(this.team.tournament) { this.teamEditorService.setExampleTeamModified(true); }
  }

  async regulationSelectEvent(event: QueryItem)
  {
    this.team.regulation = event ? await this.teamService.getRegulationByIdentifier(event.identifier) : undefined;
    if(this.team.regulation) { this.teamEditorService.setExampleTeamModified(true); }
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
        this.teamEditorService.setExampleTeamModified(true);
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
        this.teamEditorService.setExampleTeamModified(true);
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
    this.tagSmartInput.disabled.set(false);
  }

  disableTagSelector()
  {
    this.tagEditorCloseEvent();
    this.tagSmartInput.searchForm.controls.key.disable();
    this.tagSmartInput.disabled.set(true);
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

  //Privacy

  showIVsCheckEvent($event: boolean)
  {
    this.teamEditorService.setExampleTeamModified(true);
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
    this.teamEditorService.setExampleTeamModified(true);
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
    this.teamEditorService.setExampleTeamModified(true);
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
    this.teamEditorService.setExampleTeamModified(true);
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

  isInvalid(key: string) : boolean
  {
    var control = this.teamForm.get(key);
    let invalid = (control?.errors
      && (control?.dirty || control?.touched
        || this.teamFormSubmitted)) 
      ?? false;
    return invalid;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null =  this.teamForm.get(key);
    return this.util.getAuthFormError(control);
  }
}
