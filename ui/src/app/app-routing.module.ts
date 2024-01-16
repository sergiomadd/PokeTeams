import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TeamViewComponent } from './components/team-view/team-view.component';
import { AboutComponent } from './components/about/about.component';
import { VgcComponent } from './components/vgc/vgc.component';
import { MainComponent } from './components/main/main.component';
import { UserComponent } from './components/user/user.component';


const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'about', component: AboutComponent},
  { path: 'account', component: UserComponent},
  { path: ':id', component: TeamViewComponent },
  //{path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
