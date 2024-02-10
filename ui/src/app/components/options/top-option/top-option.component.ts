import { Component, EventEmitter, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user.service';
import { selectLoggedUser } from 'src/app/state/auth/auth.reducers';

@Component({
  selector: 'app-top-option',
  templateUrl: './top-option.component.html',
  styleUrls: ['./top-option.component.scss']
})
export class TopOptionComponent 
{
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  store = inject(Store);

  user$ = this.store.select(selectLoggedUser);

  logInFormSubmitted: boolean = false;
  detailsForm = this.formBuilder.group(
  {
    player: ['', [Validators.required, Validators.maxLength(256)]],
    tournament: ['', [Validators.maxLength(256)]],
    regulation: ['', [Validators.maxLength(256)]]
  });

  @Output() detailsChange = new EventEmitter();
}
