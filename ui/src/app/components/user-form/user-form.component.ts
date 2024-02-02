import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IdentityResponseDTO } from 'src/app/models/identityResponseDTO.model';
import { LogInDTO } from 'src/app/models/logindto.model';
import { SignUpDTO } from 'src/app/models/signupdto.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent 
{
  userService = inject(UserService)
  formBuilder = inject(FormBuilder)

  errors: string[] = [];
  login: boolean = true;
  signup: boolean = false;
  userNameAvailable: boolean = false;
  emailAvailable: boolean = false;

  logInFormSubmitted: boolean = false;
  logInForm = this.formBuilder.group(
  {
    userNameOrEmail: ['', [Validators.required, Validators.maxLength(256)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256)]],
  }, { updateOn: "blur" });

  signUpFormSubmitted: boolean = false;
  signUpForm = this.formBuilder.group(
    {
      username: ['', [Validators.required, Validators.maxLength(256)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.passwordsMatch()]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.passwordsMatch()]],
    }, { updateOn: "blur" });
  
  async ngOnInit()
  {
    this.signUpForm.controls.username.valueChanges.subscribe(async (value) => 
    {
      if(this.signUpForm.controls.username.valid)
      {
        this.userNameAvailable = value ? (await this.userService.checkUserNameAvailable(value)).success : false;
        this.userNameAvailable ?? this.signUpForm.controls.username.setErrors({ "usernameTaken": true });
      }
    });

    this.signUpForm.controls.email.valueChanges.subscribe(async (value) => 
    {
      if(this.signUpForm.controls.email.valid)
      {
        this.emailAvailable = value ? (await this.userService.checkEmailAvailable(value)).success : false;
        this.emailAvailable ?? this.signUpForm.controls.email.setErrors({ "emailTaken": true });
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
        password: this.logInForm.get('userNameOrEmail')?.value!,
        rememberMe: true
      }
      let response: IdentityResponseDTO = await this.userService.logIn(loginDTO);
      if(response)
      {
        this.errors = response.errors ?? [];
      }
      if(response.success)
      {
        window.location.reload();
      }
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
      console.log("signup dto", signupdto)

      let response: IdentityResponseDTO = await this.userService.signUp(signupdto);
      if(response)
      {
        this.errors = response.errors ?? [];
      }
      if(response.success)
      {
        window.location.reload();
      }
    }
  }

  changeForm()
  {
    this.login = !this.login;
    this.signup = !this.signup;
  }

  isInvalid(key: string, form: string) : boolean
  {
    var control = form === "signup" ? this.signUpForm.get(key) : this.logInForm.get(key);
    return (control?.errors
      && (control?.dirty 
        || control?.touched
        || (form === "signup" ? this.signUpFormSubmitted : this.logInFormSubmitted))) 
      ?? false;
  }

  getError(key: string, form: string) : string
  {
    var control = form === "signup" ? this.signUpForm.get(key) : this.logInForm.get(key);
    if(control?.hasError('required'))
    {
      return "This field is required";
    }
    if(control?.hasError('minlength'))
    {
      return `The field has to be longer than ${control?.getError('minlength')['requiredLength']} characters`;
    }
    if(control?.hasError('maxlength'))
    {
      return `The field has to be shorter than ${control.getError('maxlength')['requiredLength']} characters`;
    }
    if(control?.hasError('email'))
    {
      return "This field has to be a valid email";
    }
    if(control?.hasError('passwordMismatch'))
    {
      return "The passwords must match";
    }
    if(control?.hasError('usernameTaken'))
    {
      return "This username is already registered";
    }
    if(control?.hasError('emailTaken'))
    {
      return "This email is already registered";
    }
    return "error";
  }

  passwordsMatch() : ValidatorFn 
  {
    return (control: AbstractControl): ValidationErrors | null => 
    {
      const passwordControl = control.parent?.get('password');
      const confirmPasswordControl = control.parent?.get('confirmPassword');
      if (!passwordControl || !confirmPasswordControl) 
      {
        return null;
      }
      if (passwordControl.value === "" || confirmPasswordControl.value === "")
      {
        return null;
      }
      else if (passwordControl.value !== confirmPasswordControl.value) 
      {
        passwordControl.setErrors({ passwordMismatch: true });
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      else 
      {
        passwordControl.setErrors(null);
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}
