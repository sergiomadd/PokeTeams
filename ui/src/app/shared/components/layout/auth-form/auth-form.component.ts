import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { UtilService } from 'src/app/core/helpers/util.service';
import { UserService } from 'src/app/core/services/user.service';
import { authActions } from 'src/app/core/store/auth/auth.actions';
import { selectError, selectIsSubmitting, selectSuccess } from 'src/app/core/store/auth/auth.selectors';
import { LogInDTO } from 'src/app/features/user/models/login.dto';
import { SignUpDTO } from 'src/app/features/user/models/signup.dto';
import { UserUpdateDTO } from 'src/app/features/user/models/userUpdate.dto';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent 
{
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  store = inject(Store);
  util = inject(UtilService);

  data$ = combineLatest(
    {
      isSubmitting: this.store.select(selectIsSubmitting),
      backendError: this.store.select(selectError),
      success: this.store.select(selectSuccess)
    }
  )

  @Output() close = new EventEmitter();

  login: boolean = true;
  signup: boolean = false;
  forgot: boolean = false;
  userNameAvailable: boolean = false;
  emailAvailable: boolean = false;

  logInFormSubmitted: boolean = false;
  logInForm = this.formBuilder.group(
  {
    userNameOrEmail: ['', [Validators.required, Validators.maxLength(256)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256)]],
  }, { updateOn: "submit" });

  signUpFormSubmitted: boolean = false;
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
  
  forgotFormSubmitted: boolean = false;
  forgotForm = this.formBuilder.group(
  {
    email: new FormControl('', 
    {
      validators: [Validators.required, Validators.email, Validators.maxLength(256)],
      updateOn: 'blur'
    }),  
  }, { updateOn: "submit" });

  async ngOnInit()
  {
    this.signUpForm.controls.username.valueChanges.subscribe(async (value) => 
    {
      if(this.signUpForm.controls.username.valid)
      {
        this.userNameAvailable = value ? await this.userService.checkUserNameAvailable(value) : false;
        if(!this.userNameAvailable) { this.signUpForm.controls.username.setErrors({ "usernameTaken": true }); }
      }
    });

    this.signUpForm.controls.email.valueChanges.subscribe(async (value) => 
    {
      if(this.signUpForm.controls.email.valid)
      {
        this.emailAvailable = value ? await this.userService.checkEmailAvailable(value) : false;
        if(!this.emailAvailable) { this.signUpForm.controls.email.setErrors({ "emailTaken": true }); }
      }
    });
    
    //Close form when login/signup is completed
    //Do not close if forgot password is completed
    this.data$.subscribe(value =>
    {
      if(value && value.success && !this.forgot)
      {
        this.closeSelf();
      }
    })
  }

  async logIn()
  {
    this.logInFormSubmitted = true;
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
    this.signUpFormSubmitted = true;
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
    this.forgotFormSubmitted = true;
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
    this.login = true;
    this.signup = false;
    this.forgot = false;
    this.clearLogInForm();
  }

  showSignUpForm()
  {
    this.signup = true;
    this.login = false;
    this.forgot = false;
    this.clearSignUpForm();
  }

  showForgotForm()
  {
    this.signup = false;
    this.login = false;
    this.forgot = true;
    this.clearForgotForm();
  }

  clearLogInForm()
  {
    this.logInForm.reset({ userNameOrEmail: '', password: ''});
    this.logInFormSubmitted = false;
    this.userNameAvailable = false;
    this.store.dispatch(authActions.toggleAuthForm());
  }

  clearSignUpForm()
  {
    this.signUpForm.reset({ username: '', email: '', password: '', confirmPassword: ''});
    this.signUpFormSubmitted = false;
    this.userNameAvailable = false;
    this.emailAvailable = false;
    this.store.dispatch(authActions.toggleAuthForm());
  }

  clearForgotForm()
  {
    this.forgotForm.reset({ email: '' });
    this.forgotFormSubmitted = false;
    this.store.dispatch(authActions.toggleAuthForm());
  }

  closeSelf()
  {
    this.close.emit();
    this.store.dispatch(authActions.toggleAuthForm());
  }
}
