import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TeamEditPageComponent } from './team-edit-page/team-edit-page.component';

const routes: Routes = 
[
  { path: '', component: TeamEditPageComponent }
];


@NgModule({
  declarations: 
  [
    TeamEditPageComponent
  ],
  imports: 
  [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TeamEditModule { }
