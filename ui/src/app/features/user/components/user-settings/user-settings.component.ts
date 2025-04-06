import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { FeedbackColors } from 'src/app/core/models/misc/colors';
import { AuthService } from 'src/app/core/services/auth.service';
import { QueryService } from 'src/app/core/services/query.service';
import { authActions } from 'src/app/core/store/auth/auth.actions';
import { selectError, selectIsSubmitting, selectLoggedUser, selectSuccess } from 'src/app/core/store/auth/auth.selectors';
import { Country } from 'src/app/features/user/models/country.dto';
import { UserUpdateDTO } from 'src/app/features/user/models/userUpdate.dto';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../models/user.model';
import { UserPageService } from '../../services/user-page.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent 
{
  store = inject(Store);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  userService = inject(UserService);
  util = inject(UtilService);
  userPageService = inject(UserPageService);
  queryService = inject(QueryService);
  window = inject(WindowService);

  loggedUser$ = this.store.select(selectLoggedUser);
  isSubmitting$ = this.store.select(selectIsSubmitting);
  backendError$ = this.store.select(selectError);
  success$ = this.store.select(selectSuccess);

  user?: User;
  deleteDialog: boolean = false;
  
  readonly feedbackColors = FeedbackColors;

  pictures: string[] = [];
  showCatalog: boolean = false;
  changePictureSubmitted: boolean = false;
  countries: Country[] = [];
  changeCountrySubmitted: boolean = false;
  changeVisibilitySubmitted: boolean = false;
  sendEmailVerificationCodeSubmitted: boolean = false;

  changeNameButtonClicked: boolean = false;
  changeNameSubmitted: boolean = false;
  changeNameForm = this.formBuilder.group(
  {
    newName: ['', [Validators.required, Validators.maxLength(32)]],
  }, { updateOn: "submit" });

  changeUserNameButtonClicked: boolean = false;
  changeUserNameSubmitted: boolean = false;
  changeUserNameForm = this.formBuilder.group(
  {
    newUserName: ['', [Validators.required, Validators.maxLength(32)]],
  }, { updateOn: "submit" });

  changeEmailButtonClicked: boolean = false;
  changeEmailSubmitted: boolean = false;
  changeEmailForm = this.formBuilder.group(
  {
    newEmail: ['', [Validators.required, Validators.maxLength(256), Validators.email]],
  }, { updateOn: "submit" });

  changePasswordButtonClicked: boolean = false;
  changePasswordSubmitted: boolean = false;
  changePasswordForm = this.formBuilder.group(
  {
    currentPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.samePassword()]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.samePassword(), this.util.passwordsMatch()]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()]],

  }, { updateOn: "submit" });

  async ngOnInit()
  {
    this.userPageService.user.subscribe((value) => 
    {
      this.user = value;
    });

    this.pictures = await this.userService.getAllProfilePics();

    this.success$.subscribe(value => 
      {
        if(value)
        {
          if(this.changeNameSubmitted)
          {
            this.changeNameForm.reset();
            this.changeNameForm.controls.newName.setErrors(null);
          }
          if(this.changeUserNameSubmitted)
          {
            this.changeUserNameForm.reset();
            this.changeUserNameForm.controls.newUserName.setErrors(null);
          }
          if(this.changeEmailSubmitted)
          {
            this.changeEmailForm.reset();
            this.changeEmailForm.controls.newEmail.setErrors(null);
          }
          if(this.changePasswordSubmitted)
          {
            this.changePasswordForm.reset();
            this.changePasswordForm.controls.currentPassword.setErrors(null);
            this.changePasswordForm.controls.password.setErrors(null);
            this.changePasswordForm.controls.confirmPassword.setErrors(null);
          }
        }
      })
  }

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

  clickPictureSelector()
  {
    this.showCatalog = !this.showCatalog;
  }

  getPictureKey(path: string | undefined) : string
  {
    if(path)
    {
      return path.split('/')[path.split('/').length-1].split('.')[0];
    }
    return '';
  }

  changePicture(path: string)
  {
    this.resetSubmitted();
    if(path !== this.user?.picture)
    {
      this.changePictureSubmitted = true;
      const key: string = this.getPictureKey(path);
      let updateDTO: UserUpdateDTO = 
      {
        newPictureKey: key
      }
      this.store.dispatch(authActions.changePicture({request: updateDTO}));
      this.clickPictureSelector();
    }
  }

  changeCountry($event)
  {
    this.resetSubmitted();
    this.changeCountrySubmitted = true;
    let updateDTO: UserUpdateDTO = 
    {
      newCountryCode: $event.identifier
    }
    this.store.dispatch(authActions.changeCountry({request: updateDTO}));
  }

  changeVisibility($event)
  {
    this.resetSubmitted();
    this.changeVisibilitySubmitted = true;
    let updateDTO: UserUpdateDTO = 
    {
      newVisibility: $event
    }
    this.store.dispatch(authActions.changeVisibility({request: updateDTO}));
  }

  changeName()
  {
    this.resetSubmitted();
    this.changeNameButtonClicked = true;
    if(this.changeNameForm.valid && this.changeNameForm.controls.newName.value != null)
    {
      this.changeNameSubmitted = true;
      let updateDTO: UserUpdateDTO = 
      {
        newName: this.changeNameForm.controls.newName.value
      }
      this.store.dispatch(authActions.changeName({request: updateDTO}));
    }
  }

  changeUserName()
  {
    this.resetSubmitted();
    this.changeUserNameButtonClicked = true;
    if(this.changeUserNameForm.valid && this.changeUserNameForm.controls.newUserName.value != null)
    {
      this.changeUserNameSubmitted = true;
      let updateDTO: UserUpdateDTO = 
      {
        newUserName: this.changeUserNameForm.controls.newUserName.value
      }
      this.store.dispatch(authActions.changeUserName({request: updateDTO}));
    }
  }

  changeEmail()
  {
    this.resetSubmitted();
    this.changeEmailButtonClicked = true;
    if(this.changeEmailForm.valid && this.changeEmailForm.controls.newEmail.value != null)
    {
      this.changeEmailSubmitted = true;
      let updateDTO: UserUpdateDTO = 
      {
        newEmail: this.changeEmailForm.controls.newEmail.value
      }
      this.store.dispatch(authActions.changeEmail({request: updateDTO}));
    }
  }

  changePassword()
  {
    this.resetSubmitted();
    this.changePasswordButtonClicked = true;
    if(this.changePasswordForm.valid
      && this.changePasswordForm.controls.currentPassword.value != null
      && this.changePasswordForm.controls.password.value != null)
    {
      this.changePasswordSubmitted = true;
      let updateDTO: UserUpdateDTO = 
      {
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

  sendEmailVerificationCode()
  {
    this.sendEmailVerificationCodeSubmitted = true;
    this.store.dispatch(authActions.sendVerification());
  }

  isInvalid(key: string, formName: string) : boolean
  {
    var control = this.selectControl(key, formName);
    return (control?.errors && (control?.dirty || control?.touched || this.selectFormSubmittedFlag(formName))) ?? false;
  }

  getError(key: string, formName: string) : string
  {
    return this.util.getAuthFormError(this.selectControl(key, formName));
  }

  selectControl(key: string, formName: string) : AbstractControl | null
  {
    let control: AbstractControl | null = null;
    switch(formName)
    {
      case "changeNameForm":
        control = this.changeNameForm.get(key);
        break;
      case "changeUserNameForm":
        control = this.changeUserNameForm.get(key);
      break;
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
      case "changeNameForm":
        submitted = this.changeNameButtonClicked;
        break;
      case "changeUserNameForm":
        submitted = this.changeUserNameButtonClicked;
        break;
      case "changeEmailForm":
        submitted = this.changeEmailButtonClicked;
        break;
      case "changePasswordForm":
        submitted = this.changePasswordButtonClicked;
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

  resetSubmitted()
  {
    this.changePictureSubmitted = false;
    this.changeCountrySubmitted = false;
    this.changeVisibilitySubmitted = false;
    this.sendEmailVerificationCodeSubmitted = false;
    this.changeNameSubmitted = false;
    this.changeUserNameSubmitted = false;
    this.changeEmailSubmitted = false;
    this.changePasswordSubmitted = false;
  }
}