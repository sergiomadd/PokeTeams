import { Component, inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

const enum Category
{
  all = "All",
  pokemons = "Pokemons",
  players = "Players"
}

@Component({
  selector: 'app-multi-search',
  templateUrl: './multi-search.component.html',
  styleUrl: './multi-search.component.scss'
})
export class MultiSearchComponent 
{
  teamService = inject(TeamService);
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  @Input() categories?: Category[] = [Category.all, Category.players, Category.pokemons];

  selectedCategory?: Category = Category.players;
  displayCategories: boolean = false;
  results?: any[];

  searchForm = this.formBuilder.group(
    {
      key: [''],
    });

  ngOnInit()
  {
    //maybe wait 2 seconds from not typing to http call
    this.searchForm.controls.key.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        this.search(value);
      }
      else
      {
        this.results = undefined;
      }
    });
  }

  showCategories()
  {
    this.displayCategories = !this.displayCategories;
  }

  async search(key: string)
  {
    console.log(key)
    switch(this.selectedCategory)
    {
      case Category.all:
        console.log("all")
        break;
      case Category.players:
        this.results = await this.userService.queryUser(key)
        console.log("Results: ", this.results)
        break;
    }
  }

  selectCategory(category: Category)
  {
    this.selectedCategory = category;
    this.showCategories();
  }

  selectResult(selectedResult: User)
  {
    console.log(selectedResult)
    switch(this.selectedCategory)
    {
      case Category.all:
        console.log("all")
        break;
      case Category.players:
        this.router.navigateByUrl("/@" + selectedResult['userName']);
        console.log("Results: ", this.results)
        break;
    }
  }

}
