import { Component, EventEmitter, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

interface Partial
{
  uploaded: string | null;
  designed: string | null;
  tournament: string | null;
}

@Component({
  selector: 'app-top-option',
  templateUrl: './top-option.component.html',
  styleUrls: ['./top-option.component.scss']
})
export class TopOptionComponent 
{
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);

  user: User = <User>{};

  logInFormSubmitted: boolean = false;
  detailsForm = this.formBuilder.group(
  {
    uploaded: ['', [Validators.required, Validators.maxLength(256)]],
    tournament: ['', [Validators.maxLength(256)]]
  });
  @Output() detailsChange = new EventEmitter();

  

  async ngOnInit()
  {
    this.user = await this.userService.loadUser();
    if(this.user)
    {
      this.detailsForm.get('uploaded')?.setValue(this.user.username);
    }

    console.log("loaded user: ", this.user)
  }
}
