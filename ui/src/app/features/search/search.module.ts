import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchPageComponent } from './search-page/search-page.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SearchRoutingModule,
        SearchPageComponent
    ],
    exports: [
        SearchPageComponent
    ]
})
export class SearchModule { }

