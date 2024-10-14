import { Component, inject, ViewChild } from '@angular/core';
import { Pokemon } from 'src/app/features/pokemon/models/pokemon.model';
import { TagColor } from 'src/app/features/pokemon/models/pokemonColors';
import { TeamOptions } from 'src/app/features/team/models/teamOptions.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { TeamEditorComponent } from '../../../features/team-editor/pages/team-editor/team-editor.component';

@Component({
  selector: 'app-vgc',
  templateUrl: './vgc.component.html',
  styleUrls: ['./vgc.component.scss']
})
export class VgcComponent 
{
  teamService = inject(TeamService);

  teamOptions: TeamOptions = <TeamOptions>{};
  pokemons: Pokemon[] = [];
  tagColor?: TagColor = TagColor.orange;

  @ViewChild(TeamEditorComponent) teamEditorComponent!: TeamEditorComponent;


  async ngOnInit()
  {
    this.getOptions();
  }

  receivePokemon($event) 
  {
    this.pokemons.push($event);
    this.pokemons = [...this.pokemons];
  }

  getTagColor(name: string)
  {
    return TagColor[name];
  }

  getOptions()
  {
    /*
    this.teamOptions = 
    {
      showIVs: false,
      showEVs: false,
      showNature: false,
      showDexNumber: false,
      showNickname: false,
      showShinyIcon: true,
      showGenderIcon: true,
      maxLevel: 0
    }
    */
    
    this.teamOptions = 
    {
      showIVs: true,
      showEVs: true,
      showNature: true,
      showDexNumber: true,
      showNickname: true,
      showShinyIcon: true,
      showGenderIcon: true,
      maxStat: 0
    }
    
  }
}
