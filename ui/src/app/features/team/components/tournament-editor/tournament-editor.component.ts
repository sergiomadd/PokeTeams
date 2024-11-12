import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Tournament } from 'src/app/features/team/models/tournament.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { QueryService } from 'src/app/shared/services/query.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { RegulationSelectorComponent } from '../regulation-selector/regulation-selector.component';

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrl: './tournament-editor.component.scss'
})
export class TournamentEditorComponent 
{
  formBuilder = inject(FormBuilder);
  queryService = inject(QueryService);
  teamService = inject(TeamService);
  util = inject(UtilService);

  @Output() addEvent = new EventEmitter<Tournament>();
  @Output() closeEvent = new EventEmitter();

  @ViewChild(RegulationSelectorComponent) regulationSelector!: RegulationSelectorComponent;

  form = this.formBuilder.group(
    {
      name: ['', [Validators.required, Validators.maxLength(256)]],
      city: ['', [Validators.maxLength(32)]],
      countryCode: [''],
      official: [false],
      date: ['']
    });
  formSubmitted: boolean = false;

  tournament: Tournament = 
  {
    name: "",
    city: "",
    countryCode: "",
    official: false,
    regulation: undefined,
    date: ""
  };

  async ngAfterContentInit()
  {
    this.form.controls.name.valueChanges.subscribe(async value =>
      {
        this.tournament.name = value ?? "";
        if(value && !await this.teamService.checkTournamentAvailable(value))
        {
          this.form.controls.name.setErrors({ "tournamentTaken": true });
        }
      })
    this.form.controls.city.valueChanges.subscribe(value =>
      {
        this.tournament.city = value ?? "";
      })
    this.form.controls.countryCode.valueChanges.subscribe(value =>
      {
        this.tournament.countryCode = value ?? "";
      })
    this.form.controls.official.valueChanges.subscribe(value =>
      {
        this.tournament.official = value ?? false;
      })
    this.form.controls.date.valueChanges.subscribe(value =>
      {
        this.tournament.date = value ?? "";
      })
  }

  async regulationSelectEvent(event)
  {
    this.tournament.regulation = event ? await this.teamService.getRegulationByIdentifier(event.identifier) : undefined;
  }

  add()
  {
    this.formSubmitted = true;
    if(this.form.valid)
    {
      this.addEvent.emit(this.tournament);
      console.log(this.tournament)

      this.resetEditor();
    }
  }

  close()
  {
    this.closeEvent.emit();
  }

  resetEditor()
  {
    this.tournament = 
    {
      name: "",
      city: "",
      countryCode: "",
      official: false,
      regulation: undefined,
      date: ""
    };
    this.form.controls.name.setValue("");
    this.form.controls.name.markAsUntouched();
    this.form.controls.name.markAsPristine();

    this.form.controls.city.setValue("");
    this.form.controls.countryCode.setValue("");
    this.form.controls.official.setValue(false);
    this.form.controls.date.setValue("");
    this.regulationSelector.currentIndex = 0;

    this.formSubmitted = false;
  }

  isInvalid(key: string) : boolean
  {
    var control = this.form.get(key);
    return (control?.errors
      && (control?.dirty || control?.touched
        || (this.formSubmitted))) 
      ?? false;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null = this.form.get(key);
    return this.util.getAuthFormError(control);
  }

}
