import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { WindowService } from 'src/app/core/helpers/window.service';
import { Team } from 'src/app/core/models/team/team.model';
import { TeamService } from 'src/app/core/services/team.service';

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrl: './compare-page.component.scss'
})
export class ComparePageComponent 
{
  formBuilder = inject(FormBuilder);
  teamService = inject(TeamService);
  window = inject(WindowService);

  teamA?: Team;
  teamB?: Team;

  teamANotFound: boolean = false;
  teamALoading: boolean = false;
  teamAForm = this.formBuilder.group(
    {
      idA: ["", [Validators.maxLength(10)]],
    }
  )
  teamBNotFound: boolean = false;
  teamBLoading: boolean = false;
  teamBForm = this.formBuilder.group(
    {
      idB: ["", [Validators.maxLength(10)]],
    }
  )

  ngOnInit()
  {
    this.teamAForm.controls.idA.valueChanges.subscribe(async value => 
      {
        if(value)
        {
          value = this.tryGetTeamId(value)
          this.teamANotFound = false;
          this.teamALoading = true;
          this.teamService.getTeam(value).subscribe(
            {
              next: (response) =>
              {
                if(response)
                {
                  this.teamA = response;
                  this.teamALoading = false;
                }
              },
              error: (err) => 
              {
                console.log("Team A not found", err)
                this.teamANotFound = true;
                this.teamALoading = false;
              },
            }
          )
        }
        else
        {
          this.teamANotFound = false;
          this.teamALoading = false;
          this.teamA = undefined;
        }
      })
      this.teamBForm.controls.idB.valueChanges.subscribe(async value => 
        {
          if(value)
          {
            value = this.tryGetTeamId(value)
            this.teamBNotFound = false;
            this.teamBLoading = true;
            this.teamService.getTeam(value).subscribe(
              {
                next: (response) =>
                {
                  if(response)
                  {
                    this.teamB = response;
                    this.teamBLoading = false;
                  }
                },
                error: (err) => 
                {
                  console.log("Team B not found", err)
                  this.teamBNotFound = true;
                  this.teamBLoading = false;
                },
              }
            )
          }
          else
          {
            this.teamBNotFound = false;
            this.teamBLoading = false;
            this.teamB = undefined;
          }
        })
      this.teamAForm.controls.idA.setValue("http://localhost:4200/2sprxsowcw");
      this.teamBForm.controls.idB.setValue("example");
  }

  tryGetTeamId(value: string)
  {
    //Is link
    if(value.includes("/"))
    {
      return value.split("/")[value.split("/").length-1];
    }
    return value;
  }

  initOptions(team: Team)
  {
    if(team)
    {
      team.options.showIVs = true;
      team.options.showEVs = true;
      team.options.showNature = true;
    }
  }
}
