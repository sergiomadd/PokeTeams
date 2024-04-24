import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
import { Tag } from 'src/app/models/tag.model';
import { UserService } from 'src/app/services/user.service';
import { getAuthFormError } from 'src/app/services/util';

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

  detailsForm = this.formBuilder.group(
  {
    player: ['', [Validators.maxLength(256)]],
    tournament: ['', [Validators.maxLength(256)]],
    regulation: ['', [Validators.maxLength(256)]]
  });

  tags: Tag[] = [];
  tags$: Observable<Tag[]> = of(this.tags);

  tagsForm = this.formBuilder.group(
  {
    name: ['', [Validators.maxLength(256)]],
    description: ['', [Validators.maxLength(256)]],
    color: ['', [Validators.maxLength(256)]]
  });

  @Output() detailsChange = new EventEmitter();

  ngOnInit()
  {
    this.user$.subscribe((user) => 
    {
      if(user)
      {
        console.log("logged user name exists")
        this.detailsForm.controls.player.setValue(user?.username ?? null);
        this.detailsForm.controls.player.valueChanges.subscribe(async (value) => 
        {
          if(value !== user?.username)
          {
            console.log("not username")
            this.detailsForm.controls.player.setErrors({ "notLoggedUserName": true })
          }
        });
      }
    });
  }

  addTag()
  {
    if(this.tagsForm.valid)
    {
      this.tags.push(
        {
          identifier: this.tagsForm.controls.name.value ?? "",
          name: this.tagsForm.controls.name.value ?? "",
          description: this.tagsForm.controls.description.value ?? "",
          color: this.tagsForm.controls.color.value ?? "" 
        }
      )
    }
    console.log(this.tags);
    //this.tagsEvent.emit(this.tags);
  }

  isInvalid(key: string, form: string) : boolean
  {
    
    var control = this.detailsForm.get(key);
    return (control?.errors
      && (control?.dirty || control?.touched)) 
      ?? false;
  }

  getError(key: string, formKey: string) : string
  {
    let control: AbstractControl | null = this.detailsForm.get(key);
    return getAuthFormError(control);
  }
}
