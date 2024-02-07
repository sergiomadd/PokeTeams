import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { DropdownOption } from '../pieces/dropdown/dropdown.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-teams',
  templateUrl: './user-teams.component.html',
  styleUrls: ['./user-teams.component.scss']
})
export class UserTeamsComponent 
{
  @Input() teams?: Team[];
  @Input() logged?: boolean;

  sortedTeams?: Team[] = [];

  formBuilder = inject(FormBuilder)

  searchForm = this.formBuilder.group(
  {
    tournament: [''],
    regulation: [''],
    pokemon: [''],
  });
  
  selectedSorter: DropdownOption = 
  {
    name: 'Date'
  }
  sorterOptions: DropdownOption[] = 
  [
    {
      name: 'Date'
    }, 
    {
      name: 'Views'
    }
  ];

  ngOnInit()
  {
    this.sortedTeams = this.teams;

    this.searchForm.valueChanges.subscribe((value) => 
    {
      if(value.pokemon || value.tournament || value.regulation)
      {
        value ? this.search(value.pokemon, value.tournament, value.regulation) : undefined;
      }
      else
      {
        this.sortedTeams = this.teams;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['teams'])
    {
      this.sortedTeams = this.teams;
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

  search(pokemon?: string | null, tournament?: string | null, regulation?: string | null)
  {
    this.sortedTeams = [];
    if(pokemon)
    {
      this.teams?.forEach(team => 
      {
        if(team.pokemons.some(p => p.name?.toLowerCase().includes(pokemon.toLowerCase())))
        {
          this.sortedTeams?.push(team);
        }
      });
    }
    if(tournament)
    {
      this.teams?.forEach(team => 
      {
        if(team.tournament?.toLowerCase().includes(tournament.toLowerCase()))
        {
          this.sortedTeams?.push(team);
        }
      });
    }
    if(regulation)
    {
      this.teams?.forEach(team => 
      {
        if(team.regulation?.toLowerCase().includes(regulation.toLowerCase()))
        {
          this.sortedTeams?.push(team);
        }
      });
    }
  }

  //sorting

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
