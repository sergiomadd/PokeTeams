import { Component, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { GenerateTeamService } from 'src/app/services/generate-team.service';
import { PokemonPreviewComponent } from '../pokemon-preview/pokemon-preview.component';

@Component({
  selector: 'app-team-preview',
  templateUrl: './team-preview.component.html',
  styleUrls: ['./team-preview.component.scss']
})
export class TeamPreviewComponent 
{
  @Input() team?: Team;
  @Input() mode?: string;
  @Input() logged?: boolean;
  
  @ViewChildren(PokemonPreviewComponent) pokemonPreviewsComponents!: QueryList<PokemonPreviewComponent>;

  teamService = inject(GenerateTeamService);

  ngOnInit()
  {
    //console.log(this.team)
  }

  getVisibility()
  {
    return this.logged ? true : this.team?.visibility;
  }

  expand()
  {
    this.pokemonPreviewsComponents.forEach(pokemon => 
    {
      pokemon.expand();
    });
  }

  delete()
  {
    if(this.team) {this.teamService.deleteTeam(this.team?.id);}
  }
}
