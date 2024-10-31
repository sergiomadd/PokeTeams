
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Ability } from '../../features/pokemon/models/ability.model';
import { Move } from '../../features/pokemon/models/move.model';
import { Nature } from '../../features/pokemon/models/nature.model';
import { Pokemon } from '../../features/pokemon/models/pokemon.model';
import { Stat } from '../../features/pokemon/models/stat.model';
import { Type } from '../../features/pokemon/models/type.model';
import { Tag } from '../../features/team/models/tag.model';

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
    if(control?.hasError('tournamentTaken'))
    {
      return "This tournament is already registered";
    }
    if(control?.hasError('tagTaken'))
    {
      return "This tag is already registered";
    }
    if(control?.hasError('notLoggedUserName'))
    {
      return "The team wont be added to your user";
    }
    if(control?.hasError('min'))
    {
      return `The value has to be higher than ${control.getError('min')['min']}`;
    }
    if(control?.hasError('max'))
    {
      return `The value has to be lower than ${control.getError('max')['max']}`;
    }
    if(control?.hasError('nan'))
    {
      return `The value has to be a number`;
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
  /*
  copyTextToClipboard(text) 
  {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() 
    {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) 
    {
      console.error('Async: Could not copy text: ', err);
    });
  }
  */
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

  getPokemonTag(pokemon: Pokemon)
  {
    if(pokemon.name)
    {
      let tag: Tag = 
      {
        name: pokemon.name ?? "",
        identifier: pokemon.name ?? "",
        icon: pokemon.sprite?.base
      }
      return tag;
    }
    return undefined;
  }

  getMoveTag(move?: Move): Tag | undefined
  {
    if(move)
    {
      return {
        name: move.name,
        identifier: move.name,
        icon: move.pokeType?.iconPath
      }
    }
    return undefined;
  }

  getAbilityTag(ability?: Ability): Tag | undefined
  {
    if(ability)
    {
      return {
        name: ability.name,
        identifier: ability.name,
      }
    }
    return undefined;
  }

  getNatureTag(nature?: Nature): Tag | undefined
  {
    if(nature)
    {
      return {
        name: nature.name,
        identifier: nature.name,
      }
    }
    return undefined;
  }

  getTypeTag(type?: Type): Tag | undefined
  {
    if(type)
    {
      return {
        name: type.name,
        identifier: type.name,
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
}
