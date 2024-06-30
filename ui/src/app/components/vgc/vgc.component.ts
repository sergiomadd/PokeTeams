import { Component, inject } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { TeamService } from 'src/app/services/team.service';
import { TagColor } from 'src/app/styles/pokemonColors';

@Component({
  selector: 'app-vgc',
  templateUrl: './vgc.component.html',
  styleUrls: ['./vgc.component.scss']
})
export class VgcComponent 
{
  teamService = inject(TeamService);

  editorOptions: EditorOptions = <EditorOptions>{};
  pokemons: Pokemon[] = [];
  tagColor?: TagColor = TagColor.orange;

  async ngOnInit()
  {
    this.getOptions();
    console.log("Editor options: ", this.editorOptions);
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
    this.editorOptions = 
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
    /*
    this.editorOptions = 
    {
      showIVs: true,
      showEVs: true,
      showNature: true,
      showDexNumber: true,
      showNickname: true,
      showShinyIcon: true,
      showGenderIcon: true,
      maxLevel: 0
    }
    */
  }
}
