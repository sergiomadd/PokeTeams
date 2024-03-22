import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { GenerateTeamService } from './services/generate-team.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
  title = 'ui';
  store = inject(Store);
  teamService = inject(GenerateTeamService);

  constructor() 
  {

  }

  ngOnInit()
  {

  }
}