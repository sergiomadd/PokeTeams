
import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Item } from 'src/app/features/pokemon/models/item.model';
import { Tag } from 'src/app/features/team/models/tag.model';
import { Ability } from '../../features/pokemon/models/ability.model';
import { Move } from '../../features/pokemon/models/move.model';
import { Nature } from '../../features/pokemon/models/nature.model';
import { Pokemon } from '../../features/pokemon/models/pokemon.model';
import { Stat } from '../../features/pokemon/models/stat.model';
import { Type } from '../../features/pokemon/models/type.model';
import { QueryItem } from '../models/queryResult.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService 
{
  translate = inject(TranslateService);

  constructor() 
  {
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
      return this.translate.instant('shared.errors.required');
    }
    if(control?.hasError('minlength'))
    {
      return this.translate.instant('shared.errors.minlength', {"minlength": control?.getError('minlength')['requiredLength']});
    }
    if(control?.hasError('maxlength'))
    {
      return this.translate.instant('shared.errors.maxlength', {"maxlength": control.getError('maxlength')['requiredLength']});
    }
    if(control?.hasError('email'))
    {
      return this.translate.instant('shared.errors.email');
    }
    if(control?.hasError('passwordMismatch'))
    {
      return this.translate.instant('shared.errors.passwordMismatch');
    }
    if(control?.hasError('samePassword'))
    {
      return this.translate.instant('shared.errors.samePassword');
    }
    if(control?.hasError('usernameTaken'))
    {
      return this.translate.instant('shared.errors.usernameTaken');
    }
    if(control?.hasError('emailTaken'))
    {
      return this.translate.instant('shared.errors.emailTaken');
    }
    if(control?.hasError('tournamentTaken'))
    {
      return this.translate.instant('shared.errors.tournamentTaken');
    }
    if(control?.hasError('tagTaken'))
    {
      return this.translate.instant('shared.errors.tagTaken');
    }
    if(control?.hasError('notLoggedUserName'))
    {
      return this.translate.instant('shared.errors.notLoggedUserName');
    }
    if(control?.hasError('min'))
    {
      return this.translate.instant('shared.errors.min', {"min": control.getError('min')['min']});
    }
    if(control?.hasError('max'))
    {
      return this.translate.instant('shared.errors.max', {"max": control.getError('max')['max']});
    }
    if(control?.hasError('nan'))
    {
      return this.translate.instant('shared.errors.nan');
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

  customFormatDate(date: string)
  {
    //Format from backend YYYY-MM-DD
    const day = date.split('-')[2];
    const month = date.split('-')[1];
    const year = date.split('-')[0];
    return [day, month, year].join('/');
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

  getPokemonQueryResult(pokemon: Pokemon)
  {
    if(pokemon.name)
    {
      let queryResult: QueryItem = 
      {
        name: pokemon.name.content ?? "",
        identifier: pokemon.name.content ?? "",
        icon: pokemon.sprite?.base
      }
      return queryResult;
    }
    return undefined;
  }

  getMoveQueryResult(move?: Move): QueryItem | undefined
  {
    if(move)
    {
      return {
        name: move.name.content,
        identifier: move.name.content,
        icon: move.pokeType?.iconPath
      }
    }
    return undefined;
  }

  getItemQueryResult(item?: Item): QueryItem | undefined
  {
    if(item)
    {
      return {
        name: item.name.content,
        identifier: item.name.content,
      }
    }
    return undefined;
  }

  getAbilityQueryResult(ability?: Ability): QueryItem | undefined
  {
    if(ability)
    {
      return {
        name: ability.name.content,
        identifier: ability.name.content,
        icon: ability.hidden ? "hidden" : undefined
      }
    }
    return undefined;
  }

  getNatureQueryResult(nature?: Nature): QueryItem | undefined
  {
    if(nature)
    {
      return {
        name: nature.name.content,
        identifier: nature.name.content,
      }
    }
    return undefined;
  }

  getTypeQueryResult(type?: Type): QueryItem | undefined
  {
    if(type)
    {
      return {
        name: type.name.content,
        identifier: type.name.content,
        icon: type.iconPath
      }
    }
    return undefined;
  }

  getTypeNameImagePath(typeIconPath: string)
  {
    //https://localhost:7134/images/sprites/types/generation-ix/fire.png
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
      type: tag.type
    }
  }
}
