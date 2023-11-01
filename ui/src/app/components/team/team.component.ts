import { Component, Input } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon.model';


@Component({
  selector: 'app-team',
  template: `
  <div class="team">
    <div class="pokemons">
      <app-pokemon [pokemon]="pokemon"  [editorOptions]="editorOptions" *ngFor="let pokemon of (pokemons| async)"></app-pokemon>
    </div>
  </div>
  `,
  styleUrls: ['./team.component.scss']
})
export class TeamComponent 
{
  @Input() pokemons!: Promise<Pokemon[]>;
  @Input() editorOptions!: EditorOptions;
}
