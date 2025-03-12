import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeamViewPageComponent } from './team-view-page/team-view-page.component';

const routes: Routes = 
[
  { path: '', component: TeamViewPageComponent }
];

@NgModule({
  declarations: 
  [
    TeamViewPageComponent
  ],
  imports: 
  [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TeamViewModule { }
