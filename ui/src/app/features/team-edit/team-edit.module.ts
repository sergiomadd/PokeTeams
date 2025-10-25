import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamEditPageComponent } from './team-edit-page/team-edit-page.component';

const routes: Routes = 
[
  { path: '', component: TeamEditPageComponent }
];


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TeamEditPageComponent,
    ],
    exports: [RouterModule]
})
export class TeamEditModule { }
