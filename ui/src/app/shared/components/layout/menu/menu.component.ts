import { NgClass } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService } from '../../../../core/helpers/i18n.service';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { Chip } from '../../../../core/models/misc/chip.model';
import { Device } from '../../../../core/models/misc/device.enum';
import { flags, Lang, langs } from '../../../../core/models/misc/lang.enum';
import { selectLoggedUser } from '../../../../core/store/auth/auth.selectors';
import { configActions } from '../../../../core/store/config/config.actions';
import { selectLang, selectTheme } from '../../../../core/store/config/config.selectors';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { GetFlagIconUrlPipe } from '../../../pipes/getFlagIconUrl.pipe';
import { DropdownComponent } from '../../dumb/dropdown/dropdown.component';
import { AuthFormComponent } from '../auth-form/auth-form.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
    providers: [GetFlagIconUrlPipe],
    imports: [ClickOutsideDirective, NgClass, RouterLinkActive, RouterLink, DropdownComponent, AuthFormComponent, TranslatePipe]
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

  getFlagIconUrl = inject(GetFlagIconUrlPipe);

  readonly menuOpen = input<boolean>(true);
  readonly toggleEvent = output();

  selectedTheme = this.store.selectSignal(selectTheme);
  loggedUser = this.store.selectSignal(selectLoggedUser);
  selectedLang = this.store.selectSignal(selectLang);
  selectedLangChip = computed<Chip | undefined>(() =>
  {
    const lang = this.selectedLang();
    if(!lang) { return undefined; }
    return {
      name: `lang.${lang}`,
      identifier: lang,
      iconPath: this.getFlagIconUrl.transform(flags[langs.indexOf(lang)])
    }
  });
  rotationAngle = signal<number>(0);
  authFormOpen = signal<boolean>(false);

  lang = Lang;
  langs = langs;
  langChips = signal<Chip[]>([]);

  constructor()
  {
    this.loadLangsTags();
    this.window.currentDevice$.subscribe(value =>
      {
        if(value === Device.mobile || value === Device.smallMobile)
        {
          this.rotationAngle.set(0);
        }
        if(value === Device.desktop)
        {
          this.rotationAngle.set(180);
        }
      })
  }

  toggleMenu()
  {
    this.toggleEvent.emit()
    this.rotationAngle.update(angle => angle + 180);
  }

  clickNavigate()
  {
    if(this.window.isMobile() && this.menuOpen())
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
      this.langChips.update(chips => [...chips,
        {
          name: `lang.${langs[i]}`,
          identifier: langs[i],
          iconPath: this.getFlagIconUrl.transform(flags[i])
        }
      ])
    }
  }

  onClickOutside()
  {
    if(this.window.isMobile() && this.menuOpen())
    {
      this.toggleMenu();
    }
  }

  toggleAuthForm()
  {
    this.authFormOpen.update(value => !value);
  }
}
