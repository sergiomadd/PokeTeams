import { Component, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { Layout } from 'src/app/models/enums/layout.enum';
import { TeamPreview } from 'src/app/models/teamPreview.model';
import { ParserService } from 'src/app/services/parser.service';
import { TeamService } from 'src/app/services/team.service';
import { UtilService } from 'src/app/services/util.service';
import { PokemonPreviewComponent } from '../pokemon-preview/pokemon-preview.component';

@Component({
  selector: 'app-team-preview',
  templateUrl: './team-preview.component.html',
  styleUrls: ['./team-preview.component.scss']
})
export class TeamPreviewComponent 
{
  teamService = inject(TeamService);
  parser = inject(ParserService);
  util = inject(UtilService);

  @Input() team?: TeamPreview;
  teamID?: number;
  @Input() layout?: Layout;
  @Input() logged?: boolean;
  
  @ViewChildren(PokemonPreviewComponent) pokemonPreviewsComponents!: QueryList<PokemonPreviewComponent>;

  feedback: string | undefined = undefined;

  ngOnInit()
  {
    
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
  
  copyPaste()
  {
    if(this.team?.pokemons)
    {
      //copyToClipboard(this.parser.reversePaste(this.team?.pokemons));
    }
  }

  copyLink()
  {
    if(this.team)
    {
      this.util.copyToClipboard("http://localhost:4200/" + this.team.id);
    }
  }

  async delete()
  {
    if(this.team) 
    {
      this.feedback = await this.teamService.deleteTeam(this.team?.id);
    }
  }
}
