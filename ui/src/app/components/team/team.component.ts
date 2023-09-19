import { Component } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon';

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
    this.pokemons = [new Pokemon('poke1'), new Pokemon('poke2')];
  }
}
