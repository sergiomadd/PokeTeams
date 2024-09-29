import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tournament } from 'src/app/models/tournament.model';
import { QueryService } from 'src/app/services/query.service';
import { TeamService } from 'src/app/services/team.service';
import { RegulationSelectorComponent } from '../../regulation-selector/regulation-selector.component';

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

  @Output() addEvent = new EventEmitter<Tournament>();
  @Output() closeEvent = new EventEmitter();

  @ViewChild(RegulationSelectorComponent) regulationSelector!: RegulationSelectorComponent;

  form = this.formBuilder.group(
    {
      name: ['', Validators.required],
      city: [''],
      countryCode: [''],
      official: [false],
      date: ['']
    });

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
    this.form.controls.name.valueChanges.subscribe(value =>
      {
        this.tournament.name = value ?? "";
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
    this.addEvent.emit(this.tournament);
    this.resetEditor();
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
    this.form.controls.city.setValue("");
    this.form.controls.countryCode.setValue("");
    this.form.controls.official.setValue(false);
    this.form.controls.date.setValue("");
    this.regulationSelector.currentIndex = 0;
  }

}
