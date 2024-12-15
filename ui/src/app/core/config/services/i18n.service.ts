import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Langs } from '../models/langs.enum';

@Injectable({
  providedIn: 'root'
})
export class I18nService 
{
  translate = inject(TranslateService);

  constructor() 
  {
    this.translate.addLangs([Langs.en, Langs.es])
    this.translate.setDefaultLang(Langs.en);
  }

  switchLanguage(language: Langs)
  {
    this.translate.use(language);
  }
}
