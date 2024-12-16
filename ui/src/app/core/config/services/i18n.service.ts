import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import { Lang, langs } from '../models/lang.enum';
import { selectLang } from '../store/config.selectors';

@Injectable({
  providedIn: 'root'
})
export class I18nService 
{
  translate = inject(TranslateService);
  store = inject(Store);

  selectedLang$: Observable<string> = this.store.select(selectLang);
  selectedLang?: string;

  constructor() 
  {
    this.translate.addLangs([Lang.en, Lang.es])
    this.translate.setDefaultLang(Lang.en);
    this.selectedLang$.subscribe((value) =>
    {
      this.selectedLang = value;
      this.switchLanguage(value);
    })
  }

  switchLanguage(language: string) : Observable<string>
  {
    if(!langs.includes(language))
    {
      console.log("Error: lang not found ", language);
      return throwError(() => new Error("Error: lang not found"));
    }
    try
    {
      this.translate.use(language);
    }
    catch(ex)
    {
      console.log("Error: setting lang", ex)
      return throwError(() => new Error("Error: setting lang"));
    }
    return of(language)
  }
}
