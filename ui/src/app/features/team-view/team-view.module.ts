import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamViewPageComponent } from './team-view-page/team-view-page.component';

const routes: Routes = 
[
  { path: '', component: TeamViewPageComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TeamViewPageComponent,
    ],
    exports: [RouterModule]
})
export class TeamViewModule { }
