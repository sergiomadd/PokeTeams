import { GoogleLoginProvider, GoogleSigninButtonDirective, SocialAuthService } from '@abacritt/angularx-social-login';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { UtilService } from '../../../../core/helpers/util.service';
import { ExternalAuthDTO } from '../../../../core/models/user/externalAuth.dto';
import { LogInDTO } from '../../../../core/models/user/login.dto';
import { SignUpDTO } from '../../../../core/models/user/signup.dto';
import { UserUpdateDTO } from '../../../../core/models/user/userUpdate.dto';
import { UserService } from '../../../../core/services/user.service';
import { authActions } from '../../../../core/store/auth/auth.actions';
import { selectError, selectIsSubmitting, selectSuccess } from '../../../../core/store/auth/auth.selectors';
import { GetFormControlErrorPipe } from '../../../pipes/getFormControlError.pipe';
import { IsFormFieldInvalidPipe } from '../../../pipes/isFormFieldInvalid.pipe';
import { TooltipComponent } from '../../dumb/tooltip/tooltip.component';

@Component({
    selector: 'app-auth-form',
    templateUrl: './auth-form.component.html',
    styleUrl: './auth-form.component.scss',
    imports: [FormsModule, ReactiveFormsModule, NgTemplateOutlet, NgClass, TooltipComponent, GoogleSigninButtonDirective, TranslatePipe, IsFormFieldInvalidPipe, GetFormControlErrorPipe]
})
export class AuthFormComponent
{
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  store = inject(Store);
  util = inject(UtilService);
  socialAuthService = inject(SocialAuthService);

  isSubmitting = this.store.selectSignal(selectIsSubmitting);
  backendError = this.store.selectSignal(selectError);
  success = this.store.selectSignal(selectSuccess);
  data = computed(() => (
    {
      isSubmitting: this.isSubmitting(),
      backendError: this.backendError(),
      success: this.success()
    }
  ));

  readonly close = output();

  login = signal<boolean>(true);
  signup = signal<boolean>(false);
  forgot = signal<boolean>(false);
  userNameAvailable = signal<boolean>(false);
  emailAvailable = signal<boolean>(false);

  logInFormSubmitted = signal<boolean>(false);
  showLogInPassword = signal<boolean>(false);
  logInForm = this.formBuilder.group(
  {
    userNameOrEmail: ['', [Validators.required, Validators.maxLength(256)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256)]],
  }, { updateOn: "submit" });

  signUpFormSubmitted = signal<boolean>(false);
  showSignUpPassword = signal<boolean>(false);
  showSignUpConfirmPassword = signal<boolean>(false);
  signUpForm = this.formBuilder.group(
  {
    username: new FormControl('', 
    {
      validators: [Validators.required, Validators.maxLength(32)],
      updateOn: 'blur'
    }),
    email: new FormControl('', 
    {
      validators: [Validators.required, Validators.email, Validators.maxLength(256)],
      updateOn: 'blur'
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()],
      updateOn: 'change'
    }),
    confirmPassword: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()],
      updateOn: 'change'
    }),
  });
  formUsername = toSignal(this.signUpForm.controls.username.valueChanges);
  formEmail = toSignal(this.signUpForm.controls.email.valueChanges);
  authState = toSignal(this.socialAuthService.authState);

  forgotFormSubmitted = signal<boolean>(false);
  forgotForm = this.formBuilder.group(
  {
    email: new FormControl('', 
    {
      validators: [Validators.required, Validators.email, Validators.maxLength(256)],
      updateOn: 'blur'
    }),  
  }, { updateOn: "submit" });

  constructor()
  {
    //Close form when login/signup is completed
    //Do not close if forgot password is completed
    effect(() =>
    {
      if(this.success() && !this.forgot())
      {
        this.closeSelf();
      }
    });

    effect(() =>
    {
      const user = this.authState();
      if(user)
      {
        const externalAuthDTO: ExternalAuthDTO =
        {
          provider: GoogleLoginProvider.PROVIDER_ID,
          idToken: user.idToken
        };
        this.store.dispatch(authActions.externalLogIn({ request: externalAuthDTO }));
      }
    });

    effect(() =>
    {
      const username = this.formUsername();
      if(this.signUpForm.controls.username.valid)
      {
        this.checkUsernameAvailable(username);
      }
    });

    effect(() =>
    {
      const email = this.formEmail();
      if(this.signUpForm.controls.email.valid)
      {
        this.checkEmailAvailable(email);
      }
    });
  }

  async checkUsernameAvailable(username: string | null | undefined)
  {
    this.userNameAvailable.set(username ? await this.userService.checkUserNameAvailable(username) : false);
    if(!this.userNameAvailable()) { this.signUpForm.controls.username.setErrors({ "usernameTaken": true }); }
  }

  async checkEmailAvailable(email: string | null | undefined)
  {
    this.emailAvailable.set(email ? await this.userService.checkEmailAvailable(email) : false);
    if(!this.emailAvailable()) { this.signUpForm.controls.email.setErrors({ "emailTaken": true }); }
  }

  async logIn()
  {
    this.logInFormSubmitted.set(true);
    if(this.logInForm.valid)
    {
      let loginDTO: LogInDTO =
      {
        userNameOrEmail: this.logInForm.get('userNameOrEmail')?.value!,
        password: this.logInForm.get('password')?.value!,
        rememberMe: true
      }
      this.store.dispatch(authActions.logIn({request: loginDTO}))
    }
  }

  async signUp()
  {
    this.signUpFormSubmitted.set(true);
    if(this.signUpForm.valid)
    {
      let signupdto: SignUpDTO =
      {
        username: this.signUpForm.get('username')?.value!,
        email: this.signUpForm.get('email')?.value!,
        password: this.signUpForm.get('password')?.value!,
        confirmPassword: this.signUpForm.get('confirmPassword')?.value!
      }
      this.store.dispatch(authActions.signUp({request: signupdto}))
    }
  }

  forgotPassword()
  {
    this.forgotFormSubmitted.set(true);
    if(this.forgotForm.valid)
    {
      let updateDTO: UserUpdateDTO =
      {
        currentEmail: this.forgotForm.controls.email.value!
      }
      this.store.dispatch(authActions.forgotPassword({request: updateDTO}));
    }
  }

  showLogInForm()
  {
    this.login.set(true);
    this.signup.set(false);
    this.forgot.set(false);
    this.clearLogInForm();
  }

  showSignUpForm()
  {
    this.signup.set(true);
    this.login.set(false);
    this.forgot.set(false);
    this.clearSignUpForm();
  }

  showForgotForm()
  {
    this.signup.set(false);
    this.login.set(false);
    this.forgot.set(true);
    this.clearForgotForm();
  }

  clearLogInForm()
  {
    this.logInForm.reset({ userNameOrEmail: '', password: ''});
    this.logInFormSubmitted.set(false);
    this.userNameAvailable.set(false);
    this.store.dispatch(authActions.toggleAuthForm());
  }

  clearSignUpForm()
  {
    this.signUpForm.reset({ username: '', email: '', password: '', confirmPassword: ''});
    this.signUpFormSubmitted.set(false);
    this.userNameAvailable.set(false);
    this.emailAvailable.set(false);
    this.store.dispatch(authActions.toggleAuthForm());
  }

  clearForgotForm()
  {
    this.forgotForm.reset({ email: '' });
    this.forgotFormSubmitted.set(false);
    this.store.dispatch(authActions.toggleAuthForm());
  }

  closeSelf()
  {
    this.close.emit();
    this.store.dispatch(authActions.toggleAuthForm());
  }

  toggleShowPassword(key: string)
  {
    switch(key)
    {
      case "logInPassword":
        this.showLogInPassword.update(value => !value);
        break;
      case "signUpPassword":
        this.showSignUpPassword.update(value => !value);
        break;
      case "signUpConfirmPassword":
        this.showSignUpConfirmPassword.update(value => !value);
        break;
    }
  }
}
