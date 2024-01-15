import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

  logInFormSubmitted: boolean = false;
  logInForm = this.formBuilder.group(
  {
    userNameOrEmail: ['', [Validators.required, Validators.maxLength(256)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256)]],
  });

  signUpFormSubmitted: boolean = false;
  signUpForm = this.formBuilder.group(
    {
      userName: ['', [Validators.required, Validators.maxLength(256)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.passwordsMatch()]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.passwordsMatch()]],
    });
  
  async logIn()
  {
    this.logInFormSubmitted = true;
    if(this.logInForm.valid)
    {
      console.log("login form", this.logInForm)
    }
    //this.errors = [...(await this.userService.logIn("form")).errors]
  }

  async signUp()
  {
    this.signUpFormSubmitted = true;
    if(this.signUpForm.valid)
    {
      console.log("signup form", this.signUpForm)
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
    return "error";
  }

  passwordsMatch(): ValidatorFn 
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
