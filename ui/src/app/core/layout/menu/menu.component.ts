import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { User } from 'src/app/features/user/models/user.model';
import { selectLoggedUser } from '../../auth/store/auth.selectors';
import { flags, Lang, langs } from '../../config/models/lang.enum';
import { I18nService } from '../../config/services/i18n.service';
import { configActions } from '../../config/store/config.actions';
import { selectLang, selectTheme } from '../../config/store/config.selectors';
import { Device } from '../mobile/device.enum';
import { WindowService } from '../mobile/window.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent 
{
  router = inject(Router)
  store = inject(Store);
  themes = inject(ThemeService);
  themeService = inject(ThemeService);
  i18n = inject(I18nService);
  lang = Lang;
  langs = langs;
  window = inject(WindowService);

  @Input() menuOpen: boolean = true;
  @Output() toggleEvent = new EventEmitter();

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  loggedUser$: Observable<User | null> = this.store.select(selectLoggedUser);
  loggedUser?: User;
  selectedLang$: Observable<string> = this.store.select(selectLang);
  selectedLang?: string;
  selectedLangTag?: Tag;
  rotationAngle: number = 0;

  ngOnInit()
  { 
    this.loggedUser$.subscribe(value =>
      {
        this.loggedUser = value ?? undefined;
      });
    this.selectedLang$.subscribe(value => 
      {
        this.selectedLang = value;
        if(value)
        {
          this.selectedLangTag = 
          {
            name: `lang.${value}`,
            identifier: value,
            icon: `https://localhost:7134/images/sprites/flags/${flags[langs.indexOf(value)]}.svg`
          }
        }
      })
    this.window.currentDevice$.subscribe(value => 
      {
        if(value === Device.mobile || Device.smallMobile)
        {
          this.rotationAngle = 0;
        }
        if(value === Device.desktop)
        {
          this.rotationAngle = 180;
        }
      })
  }

  toggleMenu()
  {
    this.toggleEvent.emit()
    this.rotationAngle += this.menuOpen ? 180 : 180;
  }

  navigate(pageName:string)
  {
    this.router.navigate([`${pageName}`]);
  }

  navigateLoggedUser(username)
  {
    this.router.navigate([`/@${username}`]);
  }

  toggleTheme()
  {
    this.themeService.toggleTheme();
  }

  selectLang(event)
  {
    this.store.dispatch(configActions.changeLang({request: event.identifier}))
  }
  
  getLangsTags(): Tag[]
  {
    let tags: Tag[] = [];
    for(let i = 0; i < langs.length; i++)
    {
      tags.push(
        {
          name: `lang.${langs[i]}`,
          identifier: langs[i],
          icon: `https://localhost:7134/images/sprites/flags/${flags[i]}.svg`
        }
      )
    }
    return tags;
  }
}
