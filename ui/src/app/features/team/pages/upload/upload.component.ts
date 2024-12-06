import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomError } from 'src/app/shared/models/customError.model';
import { Team } from '../../models/team.model';
import { TeamSaveResponse } from '../../models/teamSaveResponse.model';
import { TeamEditorService } from '../../services/team-editor.service';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent 
{
  router = inject(Router);
  teamService = inject(TeamService);
  teamEditorService = inject(TeamEditorService);

  team: Team = <Team>{};
  feedback?: string;
  teamSubmitted: boolean = false;

  async ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    });
  }

  async generateTeam()
  {
    if(this.team.pokemons.length > 0 
      && this.team.pokemons.length <= 6 
      && this.team.pokemons.some(p => p.dexNumber)) //If dexNumber is undefined -> empty pokemon
    {
      console.log("Generating team: ", this.team);
      this.teamSubmitted = true;
      this.teamService.saveTeam(this.team).subscribe(
        {
          next: (response: TeamSaveResponse) =>
          {
            this.teamSubmitted = false;
            console.log("Team response: ", response)
            if(response && response.content)
            {
              this.router.navigate(['/', response.content])
            }
            this.feedback = undefined;
          },
          error: (error: CustomError) => 
          {
            this.teamSubmitted = false;
            this.feedback = error.message;
          }
        }
      )
    }
    else if(this.team.pokemons.length <= 0)
    {
      console.log("Error: no pokemons loaded")
      this.feedback = "No pokemons loaded";
    }
    else if(this.team.pokemons.length > 6)
    {
      console.log("Error: too many pokemons, limit is 6")
      this.feedback = "Too many pokemons, max is 6";
    }
    else if(this.team.pokemons.some(p => !p.dexNumber))
    {
      console.log("Error: there are empty pokemons")
      this.feedback = "There are empty pokemons";
    }
    else
    {
      console.log("Error: error uploading team")
      this.feedback = "Error uploading team";
    }
  }
}
