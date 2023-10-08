import { Component } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-team',
  template: `
  <div class="team" *ngFor="let pokemon of pokemons">
    <app-pokemon [pokemon]="pokemon"></app-pokemon>
  </div>
  `,
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {

  pokemons: Pokemon[];
  posts: any;

  constructor(private httpService: HttpService)
  {
    this.pokemons = [];
    /*
    this.pokemons = 
    [
      {
        name: "ditto",
        nickname: "ameba",
        number: 1,
        item: "",
        ability: "",
        nature: "",
        teraType: "",
        moves: [],
        evs: [],
        ivs: [],
        level: 1,
        stats: [],
        shiny: false,
        gender: "",
      }
    ];
    */
  }

  ngOnInit()
  {

    this.httpService.getPosts().subscribe(
      {
        next: (response) => 
        {
           this.posts = response;
           console.log('response: ', response);
        },
        error: (error) => { console.log(error); }
      }
    );

    this.httpService.getPokemon('Metagross').subscribe(
      {
        next: (response) => 
        {
           this.posts = response;
           console.log('pokemon: ', response);
        },
        error: (error) => { console.log(error); }
      }
    );
  }

}
