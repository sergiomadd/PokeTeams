import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadPageComponent } from './upload-page/upload-page.component';

const routes: Routes = 
[
  { path: '', component: UploadPageComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        UploadPageComponent
    ],
    exports: [RouterModule]
})
export class UploadModule { }
