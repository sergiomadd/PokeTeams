import { HttpErrorResponse } from "@angular/common/http";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function getErrorMessage(error: unknown) 
{
  if(error instanceof Error)
  {
    return error.message;
  } 
  if(error instanceof HttpErrorResponse)
  {
    return error.error;
  } 
  return error;
}

export function toCamelCase(o) {
  var newO, origKey, newKey, value
  if (o instanceof Array) {
    return o.map(function(value) {
        if (typeof value === "object") {
          value = toCamelCase(value)
        }
        return value
    })
  } else {
    newO = {}
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
        value = o[origKey]
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = toCamelCase(value)
        }
        newO[newKey] = value
      }
    }
  }
  return newO
}


export function getAuthFormError(control: AbstractControl | null) : string
{
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
  if(control?.hasError('samePassword'))
  {
    return "The new password must be different";
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

export function passwordsMatch() : ValidatorFn 
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

export function copyToClipboard(data: string)
{
  navigator.clipboard.writeText(data);
}