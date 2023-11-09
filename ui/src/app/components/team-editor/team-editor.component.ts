import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { GetPokemonService } from 'src/app/services/get-pokemon.service';
import { parsePaste } from 'src/app/services/parsePaste';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { EditorData } from 'src/app/models/editorData.model';
import { FormControl } from '@angular/forms';
import { SwitchComponent } from '../pieces/switch/switch.component';
import { Team } from 'src/app/models/team.model';
import { GenerateTeamService } from 'src/app/services/generate-team.service';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent 
{
  genTeam = inject(GenerateTeamService);

  @Input() pokemons!: Promise<Pokemon[]>;
  @Output() outputTeam = new EventEmitter<Team>();


  posts: any;
  paste: string = '';

  editorData!: EditorData;
  editorOptions!: EditorOptions;


  constructor()
  {

  }

  ngOnInit() 
  {
    this.getEditorData();
    this.getOptions();
  }

  getEditorData()
  {
    this.editorData = 
    {
      shinyPaths: 
      [
        {
          name: "Generation 7: Pokedex",
          identifier: "gen-vii_pokedex",
          path:"https://localhost:7134/images/sprites/shiny/gen-vii_pokedex.png"
        },
        {
          name: "Generation 8: Legend Arceus Pokedex",
          identifier: "gen-viii_legend-arceus_pokedex",
          path:"https://localhost:7134/images/sprites/shiny/gen-viii_legend-arceus_pokedex.png"
        }
      ],
      genderPaths: 
      [
        {
          name: "Male",
          identifier: "male",
          path:"https://localhost:7134/images/sprites/gender/male.png"
        },
        {
          name: "Female",
          identifier: "female",
          path:"https://localhost:7134/images/sprites/gender/female.png"
        }
      ],
      pokemonSprites: 
      [
        {
          name: "Base",
          identifier: "base",
          path:"https://localhost:7134/images/sprites/gender/female.png"
        }
      ]
    }
  }

  getOptions()
  {
    this.editorOptions = 
    {
      shiny: true,
      shinyPath: this.editorData.shinyPaths[0],
      gender: true,
      genderPath: this.editorData.shinyPaths[0],
      showLevel: true
    }
  }

  onSelect(value: string)
  {

  }

  async generateTeam()
  {
    let team: Team = 
    {
      pokemons: await this.pokemons,
      //settings: this.editorOptions
      //pokemons: "pokemons",
      settings: "options"
    }
    let teamLink: Promise<string> = this.genTeam.saveTeam(team);
    //open new tab with team link
    console.log("genearting ", team);
    console.log("generated: ", teamLink);
  }


}
