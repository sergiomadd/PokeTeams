import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
      const teamResponse: TeamSaveResponse = await this.teamService.saveTeam(this.team);
      console.log("Team response: ", teamResponse)
      if(teamResponse && teamResponse.content)
      {
        this.router.navigate(['/', teamResponse.content])
      }
      else
      {
        this.feedback = "Error generating team";
        console.log("Error generating team: empty response");
      }
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
}
