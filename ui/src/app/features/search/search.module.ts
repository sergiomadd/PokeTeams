import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchPageComponent } from './search-page/search-page.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  declarations: 
  [
    SearchPageComponent
  ],
  imports: 
  [
    CommonModule,
    SharedModule,
    SearchRoutingModule
  ],
  exports:
  [
    SearchPageComponent
  ]
})
export class SearchModule { }

