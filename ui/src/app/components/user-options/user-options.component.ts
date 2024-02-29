import { Component, Input, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { UserUpdateDTO } from 'src/app/models/DTOs/userUpdate.dto';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { getAuthFormError, passwordsMatch } from 'src/app/services/util';
import { authActions } from 'src/app/state/auth/auth.actions';
import { selectValidationErrors } from 'src/app/state/auth/auth.reducers';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss']
})
export class UserOptionsComponent 
{
  @Input() loggedUser?: User;
  deleteDialog: boolean = false;
  store = inject(Store);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  backendErrors$ = this.store.select(selectValidationErrors);

  changeEmailFormSubmitted: boolean = false;
  changeEmailForm = this.formBuilder.group(
  {
    newEmail: ['', [Validators.required, Validators.maxLength(256), Validators.email]],
  }, { updateOn: "blur" });

  changePasswordFormSubmitted: boolean = false;
  changePasswordForm = this.formBuilder.group(
  {
    currentPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.samePassword()]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.samePassword(), passwordsMatch()]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), passwordsMatch()]],

  }, { updateOn: "blur" });

  chooseEvent($event)
  {
    if($event)
    {
      this.deleteAccount();
      this.deleteDialog = !this.deleteDialog;
    }
    else
    {
      this.deleteDialog = !this.deleteDialog;
    }
  }

  changeEmail()
  {
    this.changeEmailFormSubmitted = true;
    if(this.changeEmailForm.valid && this.changeEmailForm.controls.newEmail.value != null)
    {
      let updateDTO: UserUpdateDTO = 
      {
        currentUserName: this.loggedUser?.username,
        newEmail: this.changeEmailForm.controls.newEmail.value
      }
      this.store.dispatch(authActions.changeEmail({request: updateDTO}));
    }
  }

  changePassword()
  {
    this.changePasswordFormSubmitted = true;
    if(this.changePasswordForm.valid
      && this.changePasswordForm.controls.currentPassword.value != null
      && this.changePasswordForm.controls.password.value != null)
    {
      let updateDTO: UserUpdateDTO = 
      {
        currentUserName: this.loggedUser?.username,
        currentPassword: this.changePasswordForm.controls.currentPassword.value,
        newPassword: this.changePasswordForm.controls.password.value
      }
      this.store.dispatch(authActions.changePassword({request: updateDTO}));
    }
  }

  tryDeleteAccout()
  {
    this.deleteDialog = !this.deleteDialog;
  }

  deleteAccount()
  {
    this.store.dispatch(authActions.deleteAccount()); 
  }
  
  logOut()
  {
    this.store.dispatch(authActions.logOut());
  }

  isInvalid(key: string, formName: string) : boolean
  {
    var control = this.selectControl(key, formName);
    return (control?.errors && this.selectFormSubmittedFlag(formName)) ?? false
  }

  getError(key: string, formName: string) : string
  {
    return getAuthFormError(this.selectControl(key, formName));
  }

  selectControl(key: string, formName: string) : AbstractControl | null
  {
    let control: AbstractControl | null = null;
    switch(formName)
    {
      case "changeEmailForm":
        control = this.changeEmailForm.get(key);
      break;
      case "changePasswordForm":
        control = this.changePasswordForm.get(key);
      break;
    }
    return control;
  }

  selectFormSubmittedFlag(formName: string) : boolean | null
  {
    let submitted: boolean | null = null;
    switch(formName)
    {
      case "changeEmailForm":
        submitted = this.changeEmailFormSubmitted;
      break;
      case "changePasswordForm":
        submitted = this.changePasswordFormSubmitted;
      break;
    }
    return submitted;
  }

  samePassword() : ValidatorFn 
  {
    return (control: AbstractControl): ValidationErrors | null => 
    {
      const passwordControl = control.parent?.get('password');
      const currentPasswordControl = control.parent?.get('currentPassword');
      if (!passwordControl || !currentPasswordControl) 
      {
        return null;
      }
      if (passwordControl.value === "" || currentPasswordControl.value === "")
      {
        return null;
      }
      else if (passwordControl.value === currentPasswordControl.value) 
      {
        //passwordControl.setErrors({ samePassword: true });
        currentPasswordControl.setErrors({ samePassword: true });
        return { samePassword: true };
      }
      else 
      {
        //passwordControl.setErrors(null);
        currentPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}
