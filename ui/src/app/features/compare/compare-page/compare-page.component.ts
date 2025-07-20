import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParserService } from 'src/app/core/helpers/parser.service';
import { ThemeService } from 'src/app/core/helpers/theme.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { Pokemon } from 'src/app/core/models/pokemon/pokemon.model';
import { Stat } from 'src/app/core/models/pokemon/stat.model';
import { Team } from 'src/app/core/models/team/team.model';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { TeamService } from 'src/app/core/services/team.service';

export interface ComparePokemon
{
  pokemon: Pokemon | null | undefined,
  sourceIndex: number,
  whichTeam: string
}

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrl: './compare-page.component.scss'
})
export class ComparePageComponent 
{
  formBuilder = inject(FormBuilder);
  teamService = inject(TeamService);
  window = inject(WindowService);
  theme = inject(ThemeService);
  util = inject(UtilService);
  parser = inject(ParserService);
  pokemonService = inject(PokemonService);
  activatedRoute = inject(ActivatedRoute);

  teamA?: Team;
  teamB?: Team;
  teamAId?: string;
  teamBId?: string;
  teamASelectedIndex: number[] = [];
  teamBSelectedIndex: number[] = [];

  teamANotFound: boolean = false;
  teamALoading: boolean = false;
  showPasteAInput: boolean = false;
  shrinkPasteAInput: boolean = true;
  teamAForm = this.formBuilder.group(
    {
      idA: ["", [Validators.maxLength(64)]],
      pasteA: ["", [Validators.maxLength(2048)]]
    }, { updateOn: "blur" }
  )
  teamBNotFound: boolean = false;
  teamBLoading: boolean = false;
  showPasteBInput: boolean = false;
  shrinkPasteBInput: boolean = true;
  teamBForm = this.formBuilder.group(
    {
      idB: ["", [Validators.maxLength(64)]],
      pasteB: ["", [Validators.maxLength(2048)]]
    }, { updateOn: "blur" }
  )

  statSelectors: Stat[] = 
  [
    {
      identifier: "hp",
      value: 0
    },
    {
      identifier: "attack",
      value: 0
    },
    {
      identifier: "defense",
      value: 0
    },
    {
      identifier: "special-attack",
      value: 0
    },
    {
      identifier: "special-defense",
      value: 0
    },
    {
      identifier: "speed",
      value: 0
    }
  ]; 
  selectedStatIndex: number = 5;
  selectedStat: Stat = this.statSelectors[this.selectedStatIndex];
  statList: ComparePokemon[] | undefined = undefined;

  ngOnInit()
  {
    this.activatedRoute.queryParamMap.subscribe(params => 
    {
      this.teamAId = params.get('teamAId') ?? undefined;
      if(this.teamAId)
      {
        this.getTeamA(this.teamAId);
        const url = `https://poketeams.com/${this.teamAId}`;
        this.teamAForm.controls.idA.setValue(url, { emitEvent: false });
      }
      else
      {
        this.teamANotFound = false;
        this.teamALoading = false;
        this.teamA = undefined;
        this.calculateStatList(this.selectedStatIndex);
      }

      this.teamBId = params.get('teamBId') ?? undefined;
      if(this.teamBId)
      {
        this.getTeamB(this.teamBId);
        const url = `https://poketeams.com/${this.teamBId}`;
        this.teamBForm.controls.idB.setValue(url, { emitEvent: false });
      }
      else
      {
        this.teamBNotFound = false;
        this.teamBLoading = false;
        this.teamB = undefined;
        this.calculateStatList(this.selectedStatIndex);
      }
    });

    this.teamAForm.controls.idA.valueChanges.subscribe(async value => 
    {
      const id = this.tryGetTeamId(value)
      if(id && this.teamBForm.controls.idB.valid)
      {
        this.getTeamA(id);
      }
      else
      {
        this.teamANotFound = false;
        this.teamALoading = false;
        this.teamA = undefined;
        this.calculateStatList(this.selectedStatIndex);
      }
    })
    this.teamBForm.controls.idB.valueChanges.subscribe(async value => 
    {
      const id = this.tryGetTeamId(value)
      if(id && this.teamBForm.controls.idB.valid)
      {
        this.getTeamB(id);
      }
      else
      {
        this.teamBNotFound = false;
        this.teamBLoading = false;
        this.teamB = undefined;
        this.calculateStatList(this.selectedStatIndex);
      }
    })

    this.teamAForm.controls.pasteA.valueChanges.subscribe(async value => 
    {
      if(value && this.teamAForm.controls.pasteA.valid)
      {
        this.teamA = <Team>{};
        this.teamA.pokemons = [];
        this.teamANotFound = false;
        this.teamALoading = true;
        let formData = value;
        let data = this.parser.parsePaste(formData);
        if(data.pokemons && data.pokemons.length > 0)
        {
          for(const dataPokemon in data.pokemons)
          {
            this.teamA?.pokemons.push(undefined);
          }
          await Promise.all(
            data.pokemons.map(async (pokePaste, index) => 
            {
              const pokemon = await this.pokemonService.buildPokemon(pokePaste);
              if(pokemon && this.teamA)
              { 
                this.teamA.pokemons[index] = pokemon;
                this.teamA = {...this.teamA, pokemons: this.teamA.pokemons}
                this.calculateStatList(this.selectedStatIndex);
              }
            })
          )
          this.teamALoading = false;
        }
        else
        {
          this.teamB = undefined;
          this.teamBNotFound = true;
          this.teamBLoading = false;
        }
      }
    })
    this.teamBForm.controls.pasteB.valueChanges.subscribe(async value => 
    {
      if(value && this.teamBForm.controls.pasteB.valid)
      {
        this.teamB = <Team>{};
        this.teamB.pokemons = [];
        this.teamBNotFound = false;
        this.teamBLoading = true;
        let formData = value;
        let data = this.parser.parsePaste(formData);
        if(data.pokemons && data.pokemons.length > 0)
        {
          for(const dataPokemon in data.pokemons)
          {
            this.teamB?.pokemons.push(undefined);
          }
          await Promise.all(
            data.pokemons.map(async (pokePaste, index) => 
            {
              const pokemon = await this.pokemonService.buildPokemon(pokePaste);
              if(pokemon && this.teamB)
              { 
                this.teamB.pokemons[index] = pokemon;
                this.teamB = {...this.teamB, pokemons: this.teamB.pokemons}
                this.calculateStatList(this.selectedStatIndex);
              }
            })
          )
          this.teamBLoading = false;
        }
        else
        {
          this.teamB = undefined;
          this.teamBNotFound = true;
          this.teamBLoading = false;
        }
      }
    })
    //this.teamAForm.controls.idA.setValue("http://localhost:4200/2sprxsowcw");
    //this.teamBForm.controls.idB.setValue("example");
    ///http://localhost:4200/2sprxsowcw
    //example
    //https://localhost:7134/f9xw1atocs
    //https://localhost:7134/zoqijpw43m
  }

  getTeamA(id: string)
  {
    this.teamANotFound = false;
    this.teamALoading = true;
    this.teamService.getTeam(id).subscribe(
      {
        next: (response) =>
        {
          if(response)
          {
            this.teamA = response;
            this.teamALoading = false;
            this.calculateStatList(this.selectedStatIndex);
          }
        },
        error: (err) => 
        {
          console.log("Team A not found", err)
          this.teamA = undefined;
          this.teamANotFound = true;
          this.teamALoading = false;
          this.calculateStatList(this.selectedStatIndex);
        },
      }
    )
  }

  getTeamB(id: string)
  {
    this.teamBNotFound = false;
    this.teamBLoading = true;
    this.teamService.getTeam(id).subscribe(
      {
        next: (response) =>
        {
          if(response)
          {
            this.teamB = response;
            this.teamBLoading = false;
            this.calculateStatList(this.selectedStatIndex);
          }
        },
        error: (err) => 
        {
          console.log("Team B not found", err)
          this.teamB = undefined;
          this.teamBNotFound = true;
          this.teamBLoading = false;
          this.calculateStatList(this.selectedStatIndex);
        },
      }
    )
  }

  tryGetTeamId(value): string | undefined
  {
    if(!value) { return undefined; }
    //Is link
    if(value.includes("/"))
    {
      return value.split("/")[value.split("/").length-1];
    }
    return value;
  }

  initOptions(team: Team)
  {
    if(team)
    {
      team.options.showIVs = true;
      team.options.showEVs = true;
      team.options.showNature = true;
    }
  }

  calculateStatList(statIndex: number)
  {
    if((this.teamA?.pokemons || this.teamB?.pokemons) && statIndex !== undefined)
    {
      const statListA: ComparePokemon[] | undefined =  this.teamA?.pokemons.map((pokemon, index) => ({pokemon: pokemon, whichTeam: "A", sourceIndex: index}));
      const statListB: ComparePokemon[] | undefined =  this.teamB?.pokemons.map((pokemon, index) => ({pokemon: pokemon, whichTeam: "B", sourceIndex: index}));
      if(!statListA && statListB)
      {
        this.statList = [...this.handleMismatch(this.sortByStatIndex(statListB?.concat(statListA ?? []), statIndex, false), statIndex)]
      }
      else
      {
        this.statList = [...this.handleMismatch(this.sortByStatIndex(statListA?.concat(statListB ?? []), statIndex, false), statIndex)]
      }
    }
    else
    {
      this.statList = undefined;
    }
  }

  sortByStatIndex(statList: ComparePokemon[] | undefined, statIndex: number, ascending: boolean = true): any[] 
  {
    if(statList)
    {
      return statList.sort((a, b) => 
      {
        const valA = a?.pokemon?.stats?.[statIndex]?.value ?? 0;
        const valB = b?.pokemon?.stats?.[statIndex]?.value ?? 0;
        
        return ascending ? valA - valB : valB - valA;
      });
    }
    return [];
  }
  
  //Needed to handle multiple pokemons with same stat value
  //StatList is sorted already
  handleMismatch(statList: ComparePokemon[] | undefined, statIndex: number): any[] 
  {
    if(statList)
    {
      //Gets an array of arrays of the pokemons with the same values
      let result: ComparePokemon[] = [];
      let groups: ComparePokemon[][] = [];
      let i: number = -1;
      let j: number = 0;
      for (const pokemon of statList) 
      {
        if(groups[i] && groups[i].some(p => p.pokemon?.stats?.[statIndex]?.value === pokemon?.pokemon?.stats?.[statIndex]?.value))
        {
          j++;
          groups[i][j] = pokemon;
        }
        else
        {
          i++;
          j = 0;
          groups[i] = [pokemon];
        }
      }
      //Mismatch the teams so that same value pokemons come after different team pokemon
      for (const group of groups) 
      {
        group.sort((a, b) => 
        {
          const valA = a?.sourceIndex ?? 0;
          const valB = b?.sourceIndex ?? 0;

          return valB - valA ;
        });
      }
      //Turn 2D into 1D array
      for (const group of groups) 
      {
        result = result.concat(group);
      }
      return result;
    }
    return [];
  }

  selectIndexes(indexes: number[], whichTeam: string)
  {
    if(indexes)
    {
      if(whichTeam === 'A')
      {
        this.teamASelectedIndex = [...indexes];
      }
      else if(whichTeam === 'B')
      {
        this.teamBSelectedIndex = [...indexes];
      }
    }
  }

  selectStat(index: number)
  {
    this.selectedStatIndex = index;
    this.selectedStat = this.statSelectors[index];
    this.calculateStatList(this.selectedStatIndex);
  }

  toggleAInputs()
  {
    this.showPasteAInput = !this.showPasteAInput;
  }

  toggleBInputs()
  {
    this.showPasteBInput = !this.showPasteBInput;
  }

  toggleAPasteInput()
  {
    this.shrinkPasteAInput = !this.shrinkPasteAInput;
  }

  toggleBPasteInput()
  {
    this.shrinkPasteBInput = !this.shrinkPasteBInput;
  }
}