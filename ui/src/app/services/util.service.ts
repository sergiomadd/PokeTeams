
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Stat } from '../models/pokemon/stat.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService 
{


  constructor() { }

  getErrorMessage(error: unknown) 
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

  toCamelCase(o) 
  {
    var newO, origKey, newKey, value
    if (o instanceof Array) {
      return o.map((value) => {
          if (typeof value === "object") 
          {
            value = this.toCamelCase(value)
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
            value = this.toCamelCase(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO
  }

  getAuthFormError(control: AbstractControl | null) : string
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
    if(control?.hasError('notLoggedUserName'))
    {
      return "The team wont be added to your user";
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

  copyToClipboard(data: string)
  {
    navigator.clipboard.writeText(data);
  }

  haveMinutesPassed(lastTime: number, minutesToPass: number) : boolean
  {
    const milisecondsToPass = minutesToPass * 60000;
    const passedTime = new Date().getTime() - lastTime;
    return passedTime > milisecondsToPass ? true : false;
  }

  customFormatDate(date: string)
  {
    //Format from backend YYYY-MM-DD
    const day = date.split('-')[2];
    const month = date.split('-')[1];
    const year = date.split('-')[0];
    return [day, month, year].join('/');
  }

  getStatName(stat: Stat)
  {
    const nameDict = 
    {
      "hp": "HP",
      "attack": "Atk",
      "defense": "Def",
      "special-attack": "SpA",
      "special-defense": "SpD",
      "speed": "Spe"
    }
    return nameDict[stat.identifier];
  }

  getStatColor(stat: Stat)
  {
    const statColors = 
    {
      "hp": "#FF0000",
      "attack": "#F08030",
      "defense": "#F8D030",
      "special-attack": "#6890F0",
      "special-defense": "#78C850",
      "speed": "#F85888"
    };
    return statColors[stat.identifier];
  }
}
