import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComparePageComponent } from './compare-page/compare-page.component';
import { MarginTopPipe } from './margin-top.pipe';

const routes: Routes = 
[
  { path: '', component: ComparePageComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ComparePageComponent,
        MarginTopPipe,
    ],
    exports: [RouterModule]
})
export class CompareModule { }
