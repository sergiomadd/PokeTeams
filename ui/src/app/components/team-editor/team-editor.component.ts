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
import { EditorOption } from 'src/app/models/editorOption.model';
import { TeamComponent } from '../team/team.component';

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

  @ViewChild(TeamComponent) team!:TeamComponent;

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

  updateTeam(option)
  {
    this.team.forceChange(this.editorOptions)
  }

    
  getOptions()
  {
    this.editorOptions = 
    {
      shinyPath: this.editorData.shinyPaths[8],
      gender: true,
      genderPath: this.editorData.shinyPaths[0],
      pokemonSpritesGen: this.editorData.pokemonSpritesPaths[0],
      typeIconsGen: "gen-ix",
      showStats: true,
      showIVs: true,
      showEVs: true,
      showNature: true,
      showLevel: true,
      showDexNumber: true,
      showNickname: true
    }
  }

  getEditorData()
  {
    this.editorData = 
    {
      shinyPaths: 
      [
        {
          name: "None",
          identifier: "none",
          path:"https://localhost:7134/images/sprites/null.png"
        },
        {
          name: "Generation 2",
          identifier: "gen-ii",
          path:"https://localhost:7134/images/sprites/shiny/gen-ii.png"
        },
        {
          name: "Generation 3",
          identifier: "gen-iii",
          path:"https://localhost:7134/images/sprites/shiny/gen-iii.png"
        },
        {
          name: "Generation 4",
          identifier: "gen-iv",
          path:"https://localhost:7134/images/sprites/shiny/gen-iv.png"
        },
        {
          name: "Generation 5",
          identifier: "gen-v",
          path:"https://localhost:7134/images/sprites/shiny/gen-v.png"
        },
        {
          name: "Generation 6",
          identifier: "gen-vi",
          path:"https://localhost:7134/images/sprites/shiny/gen-vi.png"
        },
        {
          name: "Generation 7",
          identifier: "gen-vii",
          path:"https://localhost:7134/images/sprites/shiny/gen-vii.png"
        },
        {
          name: "Generation 7: Lets Go",
          identifier: "gen-vii_letsgo",
          path:"https://localhost:7134/images/sprites/shiny/gen-vii_letsgo.png"
        },
        {
          name: "Generation 7: Pokedex",
          identifier: "gen-vii_pokedex",
          path:"https://localhost:7134/images/sprites/shiny/gen-vii_pokedex.png"
        },
        {
          name: "Generation 8",
          identifier: "gen-viii",
          path:"https://localhost:7134/images/sprites/shiny/gen-viii.png"
        },
        {
          name: "Generation 8: Legend Arceus",
          identifier: "gen-viii_legend-arceus",
          path:"https://localhost:7134/images/sprites/shiny/gen-viii_legend-arceus.png"
        },
        {
          name: "Generation 8: Legend Arceus Pokedex",
          identifier: "gen-viii_legend-arceus_pokedex",
          path:"https://localhost:7134/images/sprites/shiny/gen-viii_legend-arceus_pokedex.png"
        },
        {
          name: "Pokemon Home",
          identifier: "home",
          path:"https://localhost:7134/images/sprites/shiny/home.png"
        },
        {
          name: "Pokemon Stadium 2",
          identifier: "stadium-ii",
          path:"https://localhost:7134/images/sprites/shiny/stadium-ii.png"
        },
      ],
      genderPaths: 
      [
        {
          name: "None",
          identifier: "none",
          path:"https://localhost:7134/images/sprites/null.png"
        },
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
      pokemonSpritesPaths: 
      [
        {
          name: "Poke API",
          identifier: "0",
          path:"https://localhost:7134/images/sprites/pokemon/25.png"
        },
        {
          name: "Generation 1: Fire/Red",
          identifier: "1",
          path:"https://localhost:7134/images/sprites/pokemon/versions/generation-i/red-blue/25.png"
        },
        {
          name: "Generation 8",
          identifier: "16",
          path:"https://localhost:7134/images/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/25.png"
        },
        {
          name: "Gen 9",
          identifier: "17",
          path:"https://localhost:7134/images/sprites/types/generation-ix/normal.png"
        },
      ],
      typeIconPaths: 
      [
        {
          name: "Generation 9",
          identifier: "gen-ix",
          path:"https://localhost:7134/images/sprites/types/generation-ix/normal.png"
        },
        {
          name: "Generation 8",
          identifier: "gen-viii",
          path:"https://localhost:7134/images/sprites/types/generation-viii/normal.png"
        },
        {
          name: "Pokemon Go",
          identifier: "pogo",
          path:"https://localhost:7134/images/sprites/types/pokemongo/normal.png"
        },
      ]
    }
  }
}
