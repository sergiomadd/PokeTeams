import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { UtilService } from 'src/app/core/helpers/util.service';
import { UserService } from 'src/app/core/services/user.service';
import { authActions } from 'src/app/core/store/auth/auth.actions';
import { selectError, selectIsSubmitting } from 'src/app/core/store/auth/auth.selectors';
import { LogInDTO } from 'src/app/features/user/models/login.dto';
import { SignUpDTO } from 'src/app/features/user/models/signup.dto';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent 
{
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  store = inject(Store);
  util = inject(UtilService);

  data$ = combineLatest(
    {
      isSubmitting: this.store.select(selectIsSubmitting),
      backendError: this.store.select(selectError)
    }
  )

  login: boolean = true;
  signup: boolean = false;
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
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()]],
    });
  
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

  showLogInForm()
  {
    this.login = true;
    this.signup = false;
  }

  showSignUpForm()
  {
    this.signup = true;
    this.login = false;
  }

  clearLogInForm()
  {
    this.logInForm.reset();
    this.userNameAvailable = false;
  }

  clearSignUpForm()
  {
    this.signUpForm.reset();
    this.userNameAvailable = false;
    this.emailAvailable = false;
  }

  isInvalid(key: string, form: string) : boolean
  {
    var control = form === "signup" ? this.signUpForm.get(key) : this.logInForm.get(key);
    return (control?.errors
      && (control?.dirty || control?.touched
        || (form === "signup" ? this.signUpFormSubmitted : this.logInFormSubmitted))) 
      ?? false;
  }

  getError(key: string, formKey: string) : string
  {
    let control: AbstractControl | null =  formKey === "signup" ? this.signUpForm.get(key) : this.logInForm.get(key);
    return this.util.getAuthFormError(control);
  }
}
