import { Component, inject } from '@angular/core';
import { EditorData } from 'src/app/models/editorData.model';
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

  editorData?: EditorData;
  editorOptions: EditorOptions = <EditorOptions>{};
  pokemons: Pokemon[] = [];
  tagColor?: TagColor = TagColor.orange;

  async ngOnInit()
  {
    this.editorData = await this.getEditorData();
    console.log("Editor data: ", this.editorData)
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
      shinyPath: this.editorData?.shinyPaths ? this.editorData?.shinyPaths[8] :       
      {
        name: "error",
        identifier: '0',
        path: "assets/error.png"
      },
      gender: true,
      malePath: this.editorData?.malePaths ? this.editorData?.malePaths[0] : 
      {
        name: "error",
        identifier: '0',
        path: "assets/error.png"
      },
      femalePath: this.editorData?.femalePaths ? this.editorData?.femalePaths[0] : 
      {
        name: "error",
        identifier: '0',
        path: "assets/error.png"
      },
      pokemonSpritesGen: this.editorData?.pokemonSpritesPaths ? 
      {
        name: this.editorData?.pokemonSpritesPaths[0].name,
        identifier: '0',
        path: this.editorData?.pokemonSpritesPaths[0].base!
      } :       
      {
        name: "error",
        identifier: '0',
        path: "assets/error.png"
      },
      typeIconsGen: "gen-ix",
      showIVs: true,
      showEVs: true,
      showNature: true,
      showDexNumber: true,
      showNickname: true,
      maxLevel: 0
    }
  }

  async getEditorData(): Promise<EditorData>
  {
    const data: EditorData = await this.teamService.getOptionsData();
    let editorData: EditorData = 
    {
      pokemonSpritesPaths: data.pokemonSpritesPaths,
      typeIconPaths: data.typeIconPaths,
      shinyPaths: data.shinyPaths,
      malePaths: data.malePaths,
      femalePaths: data.femalePaths
    }
    return editorData
  }
}
