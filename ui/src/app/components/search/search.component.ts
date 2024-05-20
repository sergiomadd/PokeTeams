import { Component, inject, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QueryResultDTO } from 'src/app/models/DTOs/queryResult.dto';
import { SearchQueryDTO } from 'src/app/models/DTOs/searchQuery.dto';
import { TeamPreview } from 'src/app/models/teamPreview.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { DropdownOption } from '../pieces/dropdown/dropdown.component';
import { ResultStorageComponent } from '../pieces/result-storage/result-storage.component';
import { SmartInputComponent } from '../pieces/smart-input/smart-input.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent 
{
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  teamService = inject(TeamService);
  pokemonService = inject(PokemonService);

  teams: TeamPreview[] = [];
  logged?: boolean = true;
  sortedTeams?: TeamPreview[] = [];
  searched: boolean = false;

  searchForm = this.formBuilder.group(
  {
    tournament: [''],
    regulation: [''],
    pokemon: [''],
  });

  customQueryResult: QueryResultDTO = 
  {
    name: "Custom value",
    identifier: "custom"
  }

  //getters for childs
  @ViewChild('userInput') userInputComponent!: SmartInputComponent;
  queryUserCallback = async (args: any): Promise<QueryResultDTO[]> => 
  {
    return (await this.userService.queryUser(args)).map((u): QueryResultDTO => 
      ({
        name: u.username,
        identifier: u.username,
        icon: u.picture
      })).concat([this.customQueryResult]);
  }

  @ViewChild('tournamentInput') tournamentInputComponent!: SmartInputComponent;
  queryTournamentCallback = async (args: any): Promise<QueryResultDTO[]> => 
  {
    return (await this.userService.queryUser(args)).map(u => 
      ({
        name: u.username,
        identifier: u.username,
        icon: u.picture
      }));
  }

  @ViewChild('regulationInput') regulationInputComponent!: SmartInputComponent;
  queryRegulationCallback = async (args: any): Promise<QueryResultDTO[]> => 
  {
    return (await this.userService.queryUser(args)).map(u => 
      ({
        name: u.username,
        identifier: u.username,
        icon: u.picture
      }));
  }

  @ViewChild('pokemonInput') pokemonInputComponent!: SmartInputComponent;
  queryPokemonCallback = async (args: any): Promise<QueryResultDTO[]> => 
  {
    console.log(args)
    if(args)
    {
      return (await this.pokemonService.queryPokemonsByName(args)).map(p => 
        ({
          name: p.name,
          identifier: p.identifier,
          icon: p.icon
        }));
    }
    return [];
  }
  
  @ViewChild('pokemonStorage') pokemonResultStorageComponent?: ResultStorageComponent;
  pokemonSelectEvent($event: QueryResultDTO)
  {
    this.pokemonResultStorageComponent?.results.push($event);
  }

  @ViewChild('moveInput') moveInputComponent!: SmartInputComponent;
  queryMoveCallback = async (args: any): Promise<QueryResultDTO[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryMovesByName(args));
    }
    return [];
  }
  @ViewChild('moveStorage') moveResultStorageComponent?: ResultStorageComponent;
  moveSelectEvent($event: QueryResultDTO)
  {
    this.moveResultStorageComponent?.results.push($event);
  }

  @ViewChild('itemInput') itemInputComponent!: SmartInputComponent;
  queryItemCallback = async (args: any): Promise<QueryResultDTO[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryItemsByName(args));
    }
    return [];
  }
  @ViewChild('itemStorage') itemResultStorageComponent?: ResultStorageComponent;
  itemSelectEvent($event: QueryResultDTO)
  {
    this.itemResultStorageComponent?.results.push($event);
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['teams'])
    {
      this.sortedTeams = this.teams;
      this.searched = false;
    }
  }

  async ngOnInit()
  {

  }

  async search()
  {
    this.searched = true;
    let searchQuery: SearchQueryDTO = 
    {
      userName: this.userInputComponent.searchForm.controls.key.value,
      pokemons: this.pokemonResultStorageComponent?.results.map(r => r.name)
    }
    
    console.log(searchQuery)
    this.teamService.searchTeams(searchQuery).subscribe(
      {
        next: (response) => 
        {
          this.teams = response;
        },
        error: (error) => 
        {
          console.log("Team search error", error);
        },
        complete: () => 
        {
          console.log("complete")
          this.searched = false;
        }
      }
    )
  }

  //sorting

  switchVisibility($event)
  {
    if(!$event)
    {
      this.sortedTeams = this.teams;
    }
    else
    {
      this.sortedTeams = this.teams?.filter(t => t.visibility == $event);
    }
  }

  selectSorter(option: DropdownOption)
  {
    switch(option.name)
    {
      case "Date":
        //this.sortTeamsByDate()
        break;
      case "Views":
        this.sortTeamsByViews()
        break;
    }

  }

  sortTeamsByViews()
  {
    this.sortedTeams?.sort((a, b) => 
    {
      return a.viewCount - b.viewCount;
    });
  }

  sortTeamsByDate()
  {
    this.sortedTeams?.sort((a, b) => 
    {
      if(a.date && b.date)
      {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateA.getDay() + dateB.getDay();
      }
      return 0;
    });
  }
}
