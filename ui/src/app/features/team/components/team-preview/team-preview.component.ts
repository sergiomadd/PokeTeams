import { Component, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Layout } from 'src/app/features/search/models/layout.enum';
import { TeamPreview } from 'src/app/features/team/models/teamPreview.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { ParserService } from 'src/app/shared/services/parser.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { PokemonPreviewComponent } from '../../../pokemon/components/pokemon-preview/pokemon-preview.component';

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
  theme = inject(ThemeService);

  @Input() team?: TeamPreview;
  teamID?: number;
  @Input() layout?: Layout;
  @Input() logged?: boolean;
  
  @ViewChildren(PokemonPreviewComponent) pokemonPreviewsComponents!: QueryList<PokemonPreviewComponent>;

  feedback: string | undefined = undefined;

  ngOnInit()
  {
    this.theme.selectedTheme$?.getValue().name
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
