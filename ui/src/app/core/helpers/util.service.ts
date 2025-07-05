
import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { QueryItem } from '../models/misc/queryResult.model';
import { Stat } from '../models/pokemon/stat.model';
import { Tag } from '../models/team/tag.model';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService 
{
  i18n = inject(I18nService);

  private url = environment.url;

  constructor() 
  {
  }

  getAuthFormError(control: AbstractControl | null) : string
  {
    if(control?.hasError('required'))
    {
      return this.i18n.translateKey('shared.errors.required');
    }
    if(control?.hasError('minlength'))
    {
      return this.i18n.translateKeyWithParameters('shared.errors.minlength', {"minlength": control?.getError('minlength')['requiredLength']});
    }
    if(control?.hasError('maxlength'))
    {
      return this.i18n.translateKeyWithParameters('shared.errors.maxlength', {"maxlength": control.getError('maxlength')['requiredLength']});
    }
    if(control?.hasError('email'))
    {
      return this.i18n.translateKey('shared.errors.email');
    }
    if(control?.hasError('passwordMismatch'))
    {
      return this.i18n.translateKey('shared.errors.passwordMismatch');
    }
    if(control?.hasError('samePassword'))
    {
      return this.i18n.translateKey('shared.errors.samePassword');
    }
    if(control?.hasError('usernameTaken'))
    {
      return this.i18n.translateKey('shared.errors.usernameTaken');
    }
    if(control?.hasError('emailTaken'))
    {
      return this.i18n.translateKey('shared.errors.emailTaken');
    }
    if(control?.hasError('tournamentTaken'))
    {
      return this.i18n.translateKey('shared.errors.tournamentTaken');
    }
    if(control?.hasError('tagTaken'))
    {
      return this.i18n.translateKey('shared.errors.tagTaken');
    }
    if(control?.hasError('notLoggedUserName'))
    {
      return this.i18n.translateKey('shared.errors.notLoggedUserName');
    }
    if(control?.hasError('min'))
    {
      return this.i18n.translateKeyWithParameters('shared.errors.min', {"min": control.getError('min')['min']});
    }
    if(control?.hasError('max'))
    {
      return this.i18n.translateKeyWithParameters('shared.errors.max', {"max": control.getError('max')['max']});
    }
    if(control?.hasError('nan'))
    {
      return this.i18n.translateKey('shared.errors.nan');
    }
    return "error";
  }

  getAuthFormErrors(errors: ValidationErrors) : string
  {
    if(errors['required'])
    {
      return this.i18n.translateKey('shared.errors.required');
    }
    if(errors['minlength'])
    {
      return this.i18n.translateKeyWithParameters('shared.errors.minlength', {"minlength": errors['minlength']['requiredLength']});
    }
    if(errors['maxlength'])
    {
      return this.i18n.translateKeyWithParameters('shared.errors.maxlength', {"maxlength": errors['maxlength']['requiredLength']});
    }
    if(errors['email'])
    {
      return this.i18n.translateKey('shared.errors.email');
    }
    if(errors['passwordMismatch'])
    {
      return this.i18n.translateKey('shared.errors.passwordMismatch');
    }
    if(errors['samePassword'])
    {
      return this.i18n.translateKey('shared.errors.samePassword');
    }
    if(errors['usernameTaken'])
    {
      return this.i18n.translateKey('shared.errors.usernameTaken');
    }
    if(errors['emailTaken'])
    {
      return this.i18n.translateKey('shared.errors.emailTaken');
    }
    if(errors['tournamentTaken'])
    {
      return this.i18n.translateKey('shared.errors.tournamentTaken');
    }
    if(errors['tagTaken'])
    {
      return this.i18n.translateKey('shared.errors.tagTaken');
    }
    if(errors['notLoggedUserName'])
    {
      return this.i18n.translateKey('shared.errors.notLoggedUserName');
    }
    if(errors['min'])
    {
      return this.i18n.translateKeyWithParameters('shared.errors.min', {"min": errors['min']['min']});
    }
    if(errors['max'])
    {
      return this.i18n.translateKeyWithParameters('shared.errors.max', {"max": errors['max']['max']});
    }
    if(errors['nan'])
    {
      return this.i18n.translateKey('shared.errors.nan');
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
    }
  }

  copyToClipboard(text: string): boolean
  {
    let copied: boolean = false;
    if (!navigator.clipboard) 
    {
      return false;
    }
    navigator.clipboard.writeText(text).then(() =>
    {
      copied = true;
    });
    return true;
  }
  
  /*
  fallbackCopyTextToClipboard(text) 
  {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  }
  */
 
  haveMinutesPassed(lastTime: number, minutesToPass: number) : boolean
  {
    const milisecondsToPass = minutesToPass * 60000;
    const passedTime = new Date().getTime() - lastTime;
    return passedTime > milisecondsToPass ? true : false;
  }

  customFormatDate(date?: string)
  {
    //Format from backend YYYY-MM-DD
    if(date)
    {
      const day = date.split('-')[2];
      const month = date.split('-')[1];
      const year = date.split('-')[0];
      return [day, month, year].join('/');
    }
    return date;

  }

  getStatCode(stat: Stat)
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

  getStatShortIdentifier(stat: Stat)
  {
    const nameDict = 
    {
      "hp": "hp",
      "attack": "atk",
      "defense": "def",
      "special-attack": "spa",
      "special-defense": "spd",
      "speed": "spe"
    }
    return nameDict[stat.identifier];
  }

  getTypeNameImagePath(typeIconPath: string)
  {
    return typeIconPath ? typeIconPath.replace("ix", "ix_names") : typeIconPath;
  }

  isNaN(value)
  {
    return typeof +value !== "number" || isNaN(+value)
  }

  stringToBoolean(string?: string): boolean | undefined
  {
    if(string === "true" || string === "True" || string === "TRUE")
    {
      return true;
    }
    else if(string === "false" || string === "False" || string === "FALSE")
    {
      return false;
    }
    return undefined
  }

  formatCount(count: number)
  {
    let formated: string = count.toString();
    let rounded: number = count;
    let letter: string = "";
    const decimals: number = 2;
    if(count >= 1e3) 
    {
      letter = 'K'
      rounded = count / 1e3
      formated = rounded.toFixed(decimals)
    }
    formated = formated + letter;
    return formated;
  }

  tagToChip(tag: Tag): QueryItem
  {
    return {
      name: tag.name,
      identifier: tag.identifier,
      type: "tag"
    }
  }

  openInNewTab(url) 
  {
    window.open(url, '_blank');
  }

  getFlagIconUrl(countryCode?: string)
  {
    return countryCode ? `${this.url}images/flags/${countryCode}.svg` : countryCode;
  }
}
