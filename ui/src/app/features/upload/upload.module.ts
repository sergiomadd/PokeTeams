import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { UploadPageComponent } from './upload-page/upload-page.component';

const routes: Routes = 
[
  { path: '', component: UploadPageComponent }
];

@NgModule({
  declarations: 
  [
    UploadPageComponent
  ],
  imports: 
  [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UploadModule { }
