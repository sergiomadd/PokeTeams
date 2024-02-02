import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { DropdownOption } from '../pieces/dropdown/dropdown.component';
import { FormBuilder } from '@angular/forms';

enum SorterOptions
{
  Date,
  Views
}

@Component({
  selector: 'app-user-teams',
  templateUrl: './user-teams.component.html',
  styleUrls: ['./user-teams.component.scss']
})
export class UserTeamsComponent 
{
  @Input() teams?: Team[];
  sortedTeams?: Team[] = [];

  formBuilder = inject(FormBuilder)

  searchForm = this.formBuilder.group(
  {
    input: [''],
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

    this.searchForm.controls.input.valueChanges.subscribe((value) => 
    {
      value ? this.search(value) : undefined;
    })
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['teams'])
    {
      this.sortedTeams = this.teams;
    }
  }


  search(input: string)
  {
    if(input != undefined)
    {
      this.sortedTeams = [];
      this.teams?.forEach(team => 
      {
        if(team.pokemons.some(p => p.name?.toLowerCase().includes(input.toLowerCase())))
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
