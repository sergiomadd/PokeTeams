import { Component, inject, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchQueryDTO } from 'src/app/models/DTOs/searchQuery.dto';
import { SearchQueryResponseDTO } from 'src/app/models/DTOs/searchQueryResponse.dto';
import { Tag } from 'src/app/models/tag.model';
import { TeamPreview } from 'src/app/models/teamPreview.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
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
  sortedTeams: TeamPreview[] = [];
  searched: boolean = false;

  //pagination
  teamsPerPage: number = 2;
  totalTeams?: number;
  
  searchForm = this.formBuilder.group(
  {
    tournament: [''],
    regulation: [''],
    pokemon: [''],
  });

  customQueryResult: Tag = 
  {
    name: "Custom value",
    identifier: "custom"
  }

  //getters for childs
  @ViewChild('userInput') userInputComponent!: SmartInputComponent;
  queryUserCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.userService.queryUser(args)).map((u): Tag => 
      ({
        name: u.username,
        identifier: u.username,
        icon: u.picture
      })).concat([this.customQueryResult]);
  }

  @ViewChild('tournamentInput') tournamentInputComponent!: SmartInputComponent;
  queryTournamentCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.teamService.queryTournamentsByName(args)).map(t => 
      ({
        name: t.name,
        identifier: t.identifier,
        icon: t.icon
      }));
  }

  @ViewChild('regulationInput') regulationInputComponent!: SmartInputComponent;
  queryRegulationCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.teamService.getAllRegulations())
      .filter(r => 
      {
        return r.name.toLowerCase().includes(args.toLowerCase())
      })
      .map(r =>({
        name: r.name,
        identifier: r.identifier
      }));
  }
  regulationAllCallback = async (): Promise<Tag[]> => 
  {
    return (await this.teamService.getAllRegulations()).map(r => 
      ({
        name: r.name,
        identifier: r.identifier
      }));
  }

  @ViewChild('pokemonInput') pokemonInputComponent!: SmartInputComponent;
  queryPokemonCallback = async (args: any): Promise<Tag[]> => 
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
  pokemonSelectEvent($event: Tag)
  {
    this.pokemonResultStorageComponent?.results?.push($event);
  }

  @ViewChild('moveInput') moveInputComponent!: SmartInputComponent;
  queryMoveCallback = async (args: any): Promise<Tag[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryMovesByName(args));
    }
    return [];
  }
  @ViewChild('moveStorage') moveResultStorageComponent?: ResultStorageComponent;
  moveSelectEvent($event: Tag)
  {
    this.moveResultStorageComponent?.results?.push($event);
  }

  @ViewChild('itemInput') itemInputComponent!: SmartInputComponent;
  queryItemCallback = async (args: any): Promise<Tag[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryItemsByName(args));
    }
    return [];
  }
  @ViewChild('itemStorage') itemResultStorageComponent?: ResultStorageComponent;
  itemSelectEvent($event: Tag)
  {
    this.itemResultStorageComponent?.results?.push($event);
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['teams'])
    {
      this.sortedTeams = [...this.teams];
      this.searched = false;
    }
  }

  async ngOnInit()
  {

  }

  buildQueryFromForm(): SearchQueryDTO
  {
    let searchQuery: SearchQueryDTO = 
    {
      userName: this.userInputComponent.selected?.name ?? this.userInputComponent.searchForm.controls.key.value,
      tournamentName: this.tournamentInputComponent.selected?.name ?? this.tournamentInputComponent.searchForm.controls.key.value,
      regulation: this.regulationInputComponent.selected?.identifier,
      pokemons: this.pokemonResultStorageComponent?.results?.map(r => r.name),
      moves: this.moveResultStorageComponent?.results?.map(r => r.name),
      items: this.itemResultStorageComponent?.results?.map(r => r.name),
      teamsPerPage: this.teamsPerPage,
      selectedPage: 1
    }
    return searchQuery;
  }

  defaultSearch()
  {
    this.search(this.buildQueryFromForm());
  }

  search(searchQuery: SearchQueryDTO)
  {
    console.log(searchQuery)
    this.searched = true;
    this.teamService.searchTeams(searchQuery)?.subscribe(
      {
        next: (response: SearchQueryResponseDTO) => 
        {
          this.teams = response.teams;
          this.sortedTeams = [...response.teams];
          this.totalTeams = response.totalTeams;
          console.log(response);
        },
        error: (error) => 
        {
          console.log("Team search error", error);
        },
        complete: () => 
        {
          this.searched = false;
        }
      }
    )
  }

  //sorting
  sorterSettings = [[true, false, false], [true, false, false]]

  resetSorter()
  {
    this.sorterSettings.forEach(setting => 
    {
      setting[0] = true;
      setting[1] = false;
      setting[2] = false;
    });
  }

  changeSorter(index)
  {
    if(this.sorterSettings[index][0])
    {
      this.resetSorter();
      this.sorterSettings[index][0] = false;
      this.sorterSettings[index][1] = true;
      if(index == 0)
      {
        this.sortTeamsByDate(true);
      }
      else if(index == 1)
      {
        this.sortTeamsByViews(true);
      }
    }
    else if(this.sorterSettings[index][1])
    {
      this.sorterSettings[index][1] = false;
      this.sorterSettings[index][2] = true;
      if(index == 0)
      {
        this.sortTeamsByDate(false);
      }
      else if(index == 1)
      {
        this.sortTeamsByViews(false);
      }
    }
    else if(this.sorterSettings[index][2])
    {
      this.sorterSettings[index][2] = false;
      this.sorterSettings[index][0] = true;
      this.sortedTeams = [...this.teams];
    }
  }

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

  sortTeamsByViews(descending: boolean)
  {
    if(descending)
    {
      this.sortedTeams?.sort((b, a) => 
      {
        return a.viewCount - b.viewCount;
      });
    }
    else
    {
      this.sortedTeams?.sort((a, b) => 
      {
        return a.viewCount - b.viewCount;
      });
    }
  }

  sortTeamsByDate(descending: boolean)
  {
    if(descending)
    {
      this.sortedTeams?.sort((a, b) => 
      {
        if(a.date && b.date)
        {
          let dateA = Date.parse(a.date);
          let dateB = Date.parse(b.date);
          return dateA - dateB;
        }
        return 0;
      });
    }
    else
    {
      this.sortedTeams?.sort((b, a) => 
      {
        if(a.date && b.date)
        {
          let dateA = Date.parse(a.date);
          let dateB = Date.parse(b.date);
          return dateA - dateB;
        }
        return 0;
      });
    }
  }
  
  pageChange($event)
  {
    let searchQuery: SearchQueryDTO = this.buildQueryFromForm();
    searchQuery.selectedPage = $event;
    this.search(searchQuery);
  }
}
