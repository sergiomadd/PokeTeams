import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TeamViewComponent } from './components/team-view/team-view.component';
import { AboutComponent } from './components/about/about.component';
import { VgcComponent } from './components/vgc/vgc.component';


const routes: Routes = [
  { path: '', component: VgcComponent},
  { path: 'about', component: AboutComponent},
  { path: ':id', component: TeamViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
