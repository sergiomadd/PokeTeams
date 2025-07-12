import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComparePageComponent } from './compare-page/compare-page.component';

const routes: Routes = 
[
  { path: '', component: ComparePageComponent }
];

@NgModule({
  declarations: 
  [
    ComparePageComponent
  ],
  imports: 
  [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class CompareModule { }
