import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ComparePageComponent } from './compare-page/compare-page.component';
import { MarginTopPipe } from './margin-top.pipe';

const routes: Routes = 
[
  { path: '', component: ComparePageComponent }
];

@NgModule({
  declarations: 
  [
    ComparePageComponent,
    MarginTopPipe
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
