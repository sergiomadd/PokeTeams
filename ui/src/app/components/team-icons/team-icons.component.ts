import { Component, Input } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { Team } from 'src/app/models/team.model';

@Component({
  selector: 'app-team-icons',
  templateUrl: './team-icons.component.html',
  styleUrls: ['./team-icons.component.scss']
})
export class TeamIconsComponent 
{
  @Input() team?: Team;

  ngOnInit()
  {
    console.log("team icons: ", this.team)
  }

  getSprite(pokemon: Pokemon) : string | undefined
  {
      let choosenVariationPath = pokemon?.sprites ? pokemon?.sprites[0] : undefined;
      if(pokemon?.gender === "female")
      {
        return pokemon?.shiny ? choosenVariationPath?.shinyFemale : choosenVariationPath?.female
      }
      else
      {
        return pokemon?.shiny ? choosenVariationPath?.shiny : choosenVariationPath?.base
      }
  }
  
}
