import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import { authActions } from 'src/app/auth/store/auth.actions';
import { selectError } from 'src/app/auth/store/auth.selectors';
import { Country } from 'src/app/models/DTOs/country.dto';
import { UserUpdateDTO } from 'src/app/models/DTOs/userUpdate.dto';
import { UtilService } from 'src/app/shared/services/util.service';
import { User } from '../../models/user.model';
import { UserPageService } from '../../services/user-page.service';
import { UserService } from '../../services/user.service';

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

  user?: User;
  email?: string;
  emailConfirmed?: string
  deleteDialog: boolean = false;

  backendErrors$ = this.store.select(selectError);
  pictures: string[] = [];
  countries: Country[] = [];
  displayPictureSelector: boolean = false;

  changeNameFormSubmitted: boolean = false;
  changeNameForm = this.formBuilder.group(
  {
    newName: ['', [Validators.required, Validators.maxLength(256)]],
  }, { updateOn: "blur" });

  userNameAvailable: boolean = false;
  changeUserNameFormSubmitted: boolean = false;
  changeUserNameForm = this.formBuilder.group(
  {
    newUserName: ['', [Validators.required, Validators.maxLength(256)]],
  }, { updateOn: "blur" });

  changeEmailFormSubmitted: boolean = false;
  changeEmailForm = this.formBuilder.group(
  {
    newEmail: ['', [Validators.required, Validators.maxLength(256), Validators.email]],
  }, { updateOn: "blur" });

  changePasswordFormSubmitted: boolean = false;
  changePasswordForm = this.formBuilder.group(
  {
    currentPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.samePassword()]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.samePassword(), this.util.passwordsMatch()]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()]],

  }, { updateOn: "blur" });

  async ngOnInit()
  {
    this.userPageService.user.subscribe((value) => 
    {
      this.user = value;
    });

    this.changeUserNameForm.controls.newUserName.valueChanges.subscribe(async (value) => 
    {
      if(this.changeUserNameForm.controls.newUserName.valid)
      {
        this.userNameAvailable = value ? await this.userService.checkUserNameAvailable(value) : false;
        if(!this.userNameAvailable) { this.changeUserNameForm.controls.newUserName.setErrors({ "usernameTaken": true }); }
      }
    });
    this.pictures = await this.userService.getAllProfilePics();
    this.countries = await this.userService.getAllCountriesData();
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
    this.displayPictureSelector = !this.displayPictureSelector;
  }

  getPictureKey(path: string | undefined) : string
  {
    if(path)
    {
      return path.split('/')[path.split('/').length-1].split('.')[0];
    }
    return '';
  }

  async changePicture(path: string)
  {
    const key: string = this.getPictureKey(path);
    let updateDTO: UserUpdateDTO = 
    {
      currentUserName: this.user?.username,
      newPictureKey: key
    }
    this.store.dispatch(authActions.changePicture({request: updateDTO}));
    this.clickPictureSelector();
  }

  async changeCountry($event)
  {
    let updateDTO: UserUpdateDTO = 
    {
      currentUserName: this.user?.username,
      newCountryCode: $event.code
    }
    this.store.dispatch(authActions.changeCountry({request: updateDTO}));
  }

  async changeVisibility($event)
  {
    let updateDTO: UserUpdateDTO = 
    {
      currentUserName: this.user?.username,
      newVisibility: $event
    }
    this.store.dispatch(authActions.changeVisibility({request: updateDTO}));
  }

  async changeName()
  {
    this.changeNameFormSubmitted = true;
    if(this.changeNameForm.valid && this.changeNameForm.controls.newName.value != null)
    {
      let updateDTO: UserUpdateDTO = 
      {
        currentUserName: this.user?.username,
        newName: this.changeNameForm.controls.newName.value
      }
      console.log("try to")
      this.store.dispatch(authActions.changeName({request: updateDTO}));
    }
  }

  async changeUserName()
  {
    this.changeUserNameFormSubmitted = true;
    if(this.changeUserNameForm.valid && this.changeUserNameForm.controls.newUserName.value != null)
    {
      let updateDTO: UserUpdateDTO = 
      {
        currentUserName: this.user?.username,
        newUserName: this.changeUserNameForm.controls.newUserName.value
      }
      this.store.dispatch(authActions.changeUserName({request: updateDTO}));
    }
  }

  changeEmail()
  {
    this.changeEmailFormSubmitted = true;
    if(this.changeEmailForm.valid && this.changeEmailForm.controls.newEmail.value != null)
    {
      let updateDTO: UserUpdateDTO = 
      {
        currentUserName: this.user?.username,
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
        currentUserName: this.user?.username,
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
        submitted = this.changeNameFormSubmitted;
        break;
      case "changeUserNameForm":
        submitted = this.changeUserNameFormSubmitted;
        break;
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