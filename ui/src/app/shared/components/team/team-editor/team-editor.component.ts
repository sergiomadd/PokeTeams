import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { FeedbackColors } from '../../../../core/models/misc/colors';
import { QueryItem } from '../../../../core/models/misc/queryResult.model';
import { Tag } from '../../../../core/models/team/tag.model';
import { QueryService } from '../../../../core/services/query.service';
import { TeamService } from '../../../../core/services/team.service';
import { UserService } from '../../../../core/services/user.service';
import { selectLoggedUser } from '../../../../core/store/auth/auth.selectors';
import { selectTheme } from '../../../../core/store/config/config.selectors';
import { TeamEditorService } from '../../../services/team-editor.service';
import { CheckboxComponent } from '../../dumb/checkbox/checkbox.component';
import { TagEditorComponent } from '../../dumb/tag-editor/tag-editor.component';
import { TooltipComponent } from '../../dumb/tooltip/tooltip.component';
import { SmartInputComponent } from '../../smart-input/smart-input.component';
import { TeamComponent } from '../team/team.component';

@Component({
    selector: 'app-team-editor',
    templateUrl: './team-editor.component.html',
    styleUrls: ['./team-editor.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, NgClass, TooltipComponent, SmartInputComponent, TagEditorComponent, CheckboxComponent, TeamComponent, TranslatePipe]
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

  readonly teamComponent = viewChild.required(TeamComponent);

  loggedUser = this.store.selectSignal(selectLoggedUser);
  loggedUserItem = computed(() => 
    {
      const user = this.loggedUser();
      if(!user) { return undefined; }
      const userItem: QueryItem = 
      {
        identifier: user.username,
        name: user.username,
        icon: user.picture,
        type: "user"
      }
      return userItem
    }); //make query item

  selectedTheme = this.store.selectSignal(selectTheme);

  teamFormSubmitted = signal<boolean>(false);
  teamForm = this.formBuilder.group(
    {
      player: ["", [Validators.maxLength(32)]],
      rental: ["", [Validators.maxLength(32)]],
      title: ["", [Validators.maxLength(128)]],
    });
  formPlayer = toSignal(this.teamForm.controls.player.valueChanges)
  formRental = toSignal(this.teamForm.controls.rental.valueChanges)
  formTitle = toSignal(this.teamForm.controls.title.valueChanges)

  team = this.teamEditorService.team;
  currentTags = signal<number>(0);
  maxTags = signal<number>(3);
  disableTagInput = signal<boolean>(false);
  showTagEditor = signal<boolean>(false);
  tagAlreadyAdded = signal<boolean>(false);
  feedback?: string;
  teamPrivateFeedback = signal<boolean>(false);
  exampleTeamModified = signal<boolean | undefined>(undefined);
  readonly feedbackColors = FeedbackColors;

  readonly playerInput = viewChild<SmartInputComponent>('playerInput');

  constructor()
  {
    effect(() =>
    {
      const team = this.team();
      const currentTags = team.tags?.length ?? 0
      this.currentTags.set(currentTags);
      this.disableTagInput.set(currentTags >= this.maxTags() ? true : false);
      const teamComponent = this.teamComponent();
      if(teamComponent)
      {
        teamComponent.showAllStats.set(false);
        teamComponent.showAllNotes.set(false);
      }
      const loggedUser = this.loggedUser();
      if(loggedUser && this.team().user == null)
      {
        this.team.update(team => team && { ...team, user: 
          {
            username: loggedUser.name,
            picture: loggedUser.picture,
            registered: true
          }
        });
      }
      if(this.team().id === "example")
      {
        this.teamEditorService.setExampleTeamModified(false);
      }
      else
      {
        this.teamEditorService.setExampleTeamModified(undefined);
      }
    })

    //If the example paste team is modified, save it as a new team
    effect(() => 
    {
      const exampleTeamModified = this.exampleTeamModified();
      if(exampleTeamModified && this.team() && this.team().id)
      {
        this.team.update(team => team && {...team, id: ""})
      }
    })

    effect(() =>
    {
      const loggedUser = this.loggedUser();
      if(loggedUser)
      {
        this.team.update(team => team && {...team, user: 
          {
            username: loggedUser.username,
            picture: loggedUser.picture,
            registered: true
          }
        });
      }
      else
      {
        this.team.update(team => team && {...team, user: undefined});
      }
    })

    effect(() => 
    {
      const player = this.formPlayer();
      if(player)
      {
        if(player.length <= 32)
        {
          this.team.update(team => team && {...team, user: 
            {
              username: player,
              picture: undefined,
              registered: false
            }
          });
          this.teamEditorService.setExampleTeamModified(true);
        }
      }
      else
      {
        this.team.update(team => team && {...team, user: undefined});
        this.teamEditorService.setExampleTeamModified(false); 
      }
    })

    effect(() => 
    {
      const rental = this.formRental();
      if(rental)
      {
        if(rental.length <= 32)
        {
          this.team.update(team => team && {...team, rental: rental});
          this.teamEditorService.setExampleTeamModified(true);
        }
      }
      else
      {
        this.team.update(team => team && {...team, rental: undefined});
        this.teamEditorService.setExampleTeamModified(false); 
      }
    })

    effect(() => 
    {
      const title = this.formTitle();
      this.teamEditorService.setExampleTeamModified(true);
      if(title)
      {
        if(title.length <= 128)
        {
          this.team.update(team => team && {...team, title: title});
        }
      }
      else
      {
        this.team.update(team => team && {...team, title: undefined});
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

  matchUserToPlayer()
  {
    if(this.loggedUser() && this.team().user)
    {
      this.team.update(team => team && {...team, user: team.player})
      this.teamComponent().checkUserToPlayer();
      const playerInput = this.playerInput();
      const username = this.team().user?.username
      if(playerInput && username)
      {
        playerInput.setInputValue(username)
      }
    }
  }

  async tournamentSelectEvent(event?: QueryItem)
  {
    const selectedTournament = event ? await this.teamService.getTournamentByIdentifier(event.identifier) : undefined
    this.team.update(team => team && {...team, tournament: selectedTournament})
    if(selectedTournament) { this.teamEditorService.setExampleTeamModified(true); }
  }

  async regulationSelectEvent(event?: QueryItem)
  {
    const selectedRegulation = event ? await this.teamService.getRegulationByIdentifier(event.identifier) : undefined
    this.team.update(team => team && {...team, regulation: selectedRegulation})
    if(selectedRegulation) { this.teamEditorService.setExampleTeamModified(true); }
  }

  readonly tagEditorComponent = viewChild.required(TagEditorComponent);
  readonly tagSmartInput = viewChild.required<SmartInputComponent>("tagInput");
  toggleTagEditor()
  {
    if(this.showTagEditor()) { this.tagEditorCloseEvent(); }
    else { this.showTagEditor.set(true); }
    if(this.showTagEditor())
    {
      this.tagEditorComponent().setName(this.tagSmartInput().input().nativeElement.value)
    }
  }

  async tagSelectEvent(queryItem?: QueryItem)
  {
    this.feedback = undefined;
    if(queryItem)
    {
      let tag: Tag = await this.teamService.getTagByIdentifier(queryItem.identifier);
      const tags = this.team().tags;
      if(tags && tag)
      {
        if(tags.length < 3 && tags.some(t => t.identifier == tag.identifier))
        {
          this.team.update(team => team && {...team, tags: [...tags, tag]})
          const updatedTags = this.team().tags;
          if(updatedTags?.length === 3)
          {
            this.disableTagSelector();
          }
          this.currentTags.set(updatedTags ? updatedTags.length : 0);
          this.teamEditorService.setExampleTeamModified(true);
        }
        else if(tags.some(t => t.identifier == tag.identifier))
        {
          this.feedback = this.translateSergice.instant("team.editor.tag_input-feedback");
        }
      }
    }
  }

  tagAddNewEvent(tag: Tag)
  {
    this.feedback = undefined;
    const tags = this.team().tags;
    if(tags && tag)
    {
      if(tags.length < 3 && tags.some(t => t.identifier == tag.identifier))
      {
        this.team.update(team => team && {...team, tags: [...tags, tag]})
        const updatedTags = this.team().tags;
        if(updatedTags?.length === 3)
        {
          this.disableTagSelector();
        }
        this.currentTags.set(updatedTags ? updatedTags.length : 0);
        this.teamEditorService.setExampleTeamModified(true);
      }
      else if(tags.some(t => t.identifier == tag.identifier))
      {
        this.feedback = this.translateSergice.instant("team.editor.tag_input-feedback");
      }
    }
  }

  enableTagSelector()
  {
    this.tagSmartInput().searchForm.controls.key.enable();
    this.tagSmartInput().disabled.set(false);
  }

  disableTagSelector()
  {
    this.tagEditorCloseEvent();
    this.tagSmartInput().searchForm.controls.key.disable();
    this.tagSmartInput().disabled.set(true);
  }

  removeTag()
  {
    this.enableTagSelector();
    const tags = this.team().tags;
    this.currentTags.set(tags ? tags.length : 0);
  }

  tagEditorCloseEvent()
  {
    const tagEditorComponent = this.tagEditorComponent();
    if(tagEditorComponent.colorPickerOpen)
    {
      tagEditorComponent.colorPickerOpen = false;
      //Wait for color picker transition to finish
      setTimeout(() => {  this.showTagEditor.set(false); }, 400);
    }
    else
    {
      this.showTagEditor.set(false);
    }
  }

  //Privacy

  showIVsCheckEvent($event: boolean)
  {
    this.teamEditorService.setExampleTeamModified(true);
    if(this.team().visibility)
    {
      this.team.update(team => team && {...team, options: {...team.options, ivsVisibility: $event}})
    }
    else
    {
      this.teamPrivateFeedback.set(true);
    }
  }

  showEVsCheckEvent($event: boolean)
  {
    this.teamEditorService.setExampleTeamModified(true);
    if(this.team().visibility)
    {
      this.team.update(team => team && {...team, options: {...team.options, evsVisibility: $event}})
    }
    else
    {
      this.teamPrivateFeedback.set(true);
    }
  }

  showNatureCheckEvent($event: boolean)
  {
    this.teamEditorService.setExampleTeamModified(true);
    if(this.team().visibility)
    {
      this.team.update(team => team && {...team, options: {...team.options, naturesVisibility: $event}})
    }
    else
    {
      this.teamPrivateFeedback.set(true);
    }
  }

  teamVisibiltyCheckEvent($event: boolean)
  {
    this.teamEditorService.setExampleTeamModified(true);
    this.team.update(team => team && {...team, visibility: $event})
    if($event)
    {
      this.team.update(team => team && {...team, options: 
      {
        ...team.options,
        ivsVisibility: false,
        evsVisibility: false,
        naturesVisibility: false,
      }})
    }
    else
    {
      this.teamPrivateFeedback.set(true);
    }
  }

  isInvalid(key: string) : boolean
  {
    var control = this.teamForm.get(key);
    let invalid = (control?.errors
      && (control?.dirty || control?.touched
        || this.teamFormSubmitted())) 
      ?? false;
    return invalid;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null =  this.teamForm.get(key);
    return this.util.getAuthFormError(control);
  }
}