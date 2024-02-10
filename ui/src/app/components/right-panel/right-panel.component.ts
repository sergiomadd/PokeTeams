import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLoggedUser } from 'src/app/state/auth/auth.reducers';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent 
{
  router = inject(Router)
  store = inject(Store);

  user$ = this.store.select(selectLoggedUser);
}
