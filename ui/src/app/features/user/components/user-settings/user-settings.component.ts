import { SocialAuthService } from '@abacritt/angularx-social-login';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { FeedbackColors } from '../../../../core/models/misc/colors';
import { Country } from '../../../../core/models/user/country.dto';
import { User } from '../../../../core/models/user/user.model';
import { UserUpdateDTO } from '../../../../core/models/user/userUpdate.dto';
import { AuthService } from '../../../../core/services/auth.service';
import { QueryService } from '../../../../core/services/query.service';
import { UserService } from '../../../../core/services/user.service';
import { authActions } from '../../../../core/store/auth/auth.actions';
import { selectError, selectIsSubmitting, selectLoggedUser, selectSuccess } from '../../../../core/store/auth/auth.selectors';
import { DialogComponent } from '../../../../shared/components/dumb/dialog/dialog.component';
import { SwitchComponent } from '../../../../shared/components/dumb/switch/switch.component';
import { TooltipComponent } from '../../../../shared/components/dumb/tooltip/tooltip.component';
import { SmartInputComponent } from '../../../../shared/components/smart-input/smart-input.component';
import { UserPageService } from '../../services/user-page.service';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrl: './user-settings.component.scss',
    imports: [NgClass, NgTemplateOutlet, SmartInputComponent, SwitchComponent, FormsModule, ReactiveFormsModule, TooltipComponent, DialogComponent, TranslatePipe]
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
  socialAuthService = inject(SocialAuthService);

  loggedUser = this.store.selectSignal(selectLoggedUser);
  isSubmitting = this.store.selectSignal(selectIsSubmitting);
  backendError = this.store.selectSignal(selectError);
  success = this.store.selectSignal(selectSuccess);

  user = signal<User | undefined>(undefined);
  deleteDialog = signal<boolean>(false);

  readonly feedbackColors = FeedbackColors;

  pictures = signal<string[]>([]);
  showCatalog = signal<boolean>(false);
  changePictureSubmitted = signal<boolean>(false);
  countries = signal<Country[]>([]);
  changeCountrySubmitted = signal<boolean>(false);
  changeVisibilitySubmitted = signal<boolean>(false);
  sendEmailVerificationCodeSubmitted = signal<boolean>(false);

  changeNameButtonClicked = signal<boolean>(false);
  changeNameSubmitted = signal<boolean>(false);
  changeNameForm = this.formBuilder.group(
  {
    newName: ['', [Validators.required, Validators.maxLength(32)]],
  }, { updateOn: "submit" });

  changeUserNameButtonClicked = signal<boolean>(false);
  changeUserNameSubmitted = signal<boolean>(false);
  changeUserNameForm = this.formBuilder.group(
  {
    newUserName: ['', [Validators.required, Validators.maxLength(32)]],
  }, { updateOn: "submit" });

  changeEmailButtonClicked = signal<boolean>(false);
  changeEmailSubmitted = signal<boolean>(false);
  changeEmailForm = this.formBuilder.group(
  {
    newEmail: ['', [Validators.required, Validators.maxLength(256), Validators.email]],
  }, { updateOn: "submit" });

  changePasswordButtonClicked = signal<boolean>(false);
  changePasswordSubmitted = signal<boolean>(false);
  changePasswordForm = this.formBuilder.group(
  {
    currentPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.samePassword()]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.samePassword(), this.util.passwordsMatch()]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()]],

  }, { updateOn: "submit" });

  constructor()
  {
    effect(() =>
    {
      this.user.set(this.userPageService.user());
    });

    effect(() =>
    {
      if(this.success())
      {
        if(this.changeNameSubmitted())
        {
          this.changeNameForm.reset();
          this.changeNameForm.controls.newName.setErrors(null);
        }
        if(this.changeUserNameSubmitted())
        {
          this.changeUserNameForm.reset();
          this.changeUserNameForm.controls.newUserName.setErrors(null);
        }
        if(this.changeEmailSubmitted())
        {
          this.changeEmailForm.reset();
          this.changeEmailForm.controls.newEmail.setErrors(null);
        }
        if(this.changePasswordSubmitted())
        {
          this.changePasswordForm.reset();
          this.changePasswordForm.controls.currentPassword.setErrors(null);
          this.changePasswordForm.controls.password.setErrors(null);
          this.changePasswordForm.controls.confirmPassword.setErrors(null);
        }
      }
    });

    this.loadPictures();
  }

  async loadPictures()
  {
    this.pictures.set(await this.userService.getAllProfilePics());
  }

  chooseEvent($event)
  {
    if($event)
    {
      this.deleteAccount();
      this.deleteDialog.update(value => !value);
    }
    else
    {
      this.deleteDialog.update(value => !value);
    }
  }

  clickPictureSelector()
  {
    this.showCatalog.update(value => !value);
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
    if(path !== this.user()?.picture)
    {
      this.changePictureSubmitted.set(true);
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
    this.changeCountrySubmitted.set(true);
    let updateDTO: UserUpdateDTO =
    {
      newCountryCode: $event.identifier
    }
    this.store.dispatch(authActions.changeCountry({request: updateDTO}));
  }

  changeVisibility($event)
  {
    this.resetSubmitted();
    this.changeVisibilitySubmitted.set(true);
    let updateDTO: UserUpdateDTO =
    {
      newVisibility: $event
    }
    this.store.dispatch(authActions.changeVisibility({request: updateDTO}));
  }

  changeName()
  {
    this.resetSubmitted();
    this.changeNameButtonClicked.set(true);
    if(this.changeNameForm.valid && this.changeNameForm.controls.newName.value != null)
    {
      this.changeNameSubmitted.set(true);
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
    this.changeUserNameButtonClicked.set(true);
    if(this.changeUserNameForm.valid && this.changeUserNameForm.controls.newUserName.value != null)
    {
      this.changeUserNameSubmitted.set(true);
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
    this.changeEmailButtonClicked.set(true);
    if(this.changeEmailForm.valid && this.changeEmailForm.controls.newEmail.value != null)
    {
      this.changeEmailSubmitted.set(true);
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
    this.changePasswordButtonClicked.set(true);
    if(this.changePasswordForm.valid
      && this.changePasswordForm.controls.currentPassword.value != null
      && this.changePasswordForm.controls.password.value != null)
    {
      this.changePasswordSubmitted.set(true);
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
    this.deleteDialog.update(value => !value);
  }

  deleteAccount()
  {
    this.socialAuthService.signOut();
    this.store.dispatch(authActions.deleteAccount());
  }

  logOut()
  {
    this.socialAuthService.signOut();
    this.store.dispatch(authActions.logOut());
  }

  sendEmailVerificationCode()
  {
    this.sendEmailVerificationCodeSubmitted.set(true);
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
        submitted = this.changeNameButtonClicked();
        break;
      case "changeUserNameForm":
        submitted = this.changeUserNameButtonClicked();
        break;
      case "changeEmailForm":
        submitted = this.changeEmailButtonClicked();
        break;
      case "changePasswordForm":
        submitted = this.changePasswordButtonClicked();
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
    this.changePictureSubmitted.set(false);
    this.changeCountrySubmitted.set(false);
    this.changeVisibilitySubmitted.set(false);
    this.sendEmailVerificationCodeSubmitted.set(false);
    this.changeNameSubmitted.set(false);
    this.changeUserNameSubmitted.set(false);
    this.changeEmailSubmitted.set(false);
    this.changePasswordSubmitted.set(false);
  }
}
