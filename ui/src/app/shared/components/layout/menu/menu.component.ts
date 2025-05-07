import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { I18nService } from 'src/app/core/helpers/i18n.service';
import { ThemeService } from 'src/app/core/helpers/theme.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { selectLoggedUser } from 'src/app/core/store/auth/auth.selectors';
import { User } from 'src/app/features/user/models/user.model';
import { WindowService } from '../../../../core/helpers/window.service';
import { Chip } from '../../../../core/models/misc/chip.model';
import { Device } from '../../../../core/models/misc/device.enum';
import { flags, Lang, langs } from '../../../../core/models/misc/lang.enum';
import { configActions } from '../../../../core/store/config/config.actions';
import { selectLang, selectTheme } from '../../../../core/store/config/config.selectors';

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
  window = inject(WindowService);
  util = inject(UtilService);

  @Input() menuOpen: boolean = true;
  @Output() toggleEvent = new EventEmitter();

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  loggedUser$: Observable<User | null> = this.store.select(selectLoggedUser);
  loggedUser?: User;
  selectedLang$: Observable<string> = this.store.select(selectLang);
  selectedLang?: string;
  selectedLangChip?: Chip;
  rotationAngle: number = 0;

  lang = Lang;
  langs = langs;
  langChips: Chip[] = []

  ngOnInit()
  { 
    this.loadLangsTags();
    this.loggedUser$.subscribe(value =>
      {
        this.loggedUser = value ?? undefined;
      });
    this.selectedLang$.subscribe(value => 
      {
        this.selectedLang = value;
        if(value)
        {
          this.selectedLangChip = 
          {
            name: `lang.${value}`,
            identifier: value,
            iconPath: this.util.getFlagIconUrl(flags[langs.indexOf(value)])
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

  clickNavigate()
  {
    if(this.window.isMobile() && this.menuOpen)
    {
      this.toggleMenu();
    }
  }

  toggleTheme()
  {
    this.themeService.toggleTheme();
  }

  selectLang(event)
  {
    this.store.dispatch(configActions.changeLang({request: event.identifier}))
  }
  
  loadLangsTags()
  {
    for(let i = 0; i < langs.length; i++)
    {
      this.langChips.push(
        {
          name: `lang.${langs[i]}`,
          identifier: langs[i],
          iconPath: this.util.getFlagIconUrl(flags[i])
        }
      )
    }
  }

  onClickOutside()
  {
    if(this.window.isMobile() && this.menuOpen)
    {
      this.toggleMenu();
    }
  }
}
