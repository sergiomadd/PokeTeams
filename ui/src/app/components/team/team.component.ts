import { Component } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';

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

  constructor()
  {
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
  }
}
