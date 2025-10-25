import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { TeamSearchComponent } from '../../../../shared/components/team/team-search/team-search.component';
import { TeamTableComponent } from '../../../../shared/components/team/team-table/team-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-user-teams',
    templateUrl: './user-teams.component.html',
    styleUrl: './user-teams.component.scss',
    imports: [NgClass, TeamSearchComponent, TeamTableComponent, TranslatePipe]
})
export class UserTeamsComponent 
{
  searchVisible: boolean = false;

  toggleSearch()
  {
    this.searchVisible = !this.searchVisible;
  }
}
