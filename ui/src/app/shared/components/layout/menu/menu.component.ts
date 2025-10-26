import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { I18nService } from '../../../../core/helpers/i18n.service';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { Chip } from '../../../../core/models/misc/chip.model';
import { Device } from '../../../../core/models/misc/device.enum';
import { flags, Lang, langs } from '../../../../core/models/misc/lang.enum';
import { User } from '../../../../core/models/user/user.model';
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
    imports: [ClickOutsideDirective, NgClass, RouterLinkActive, RouterLink, DropdownComponent, AuthFormComponent, AsyncPipe, TranslatePipe]
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

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  loggedUser$: Observable<User | null> = this.store.select(selectLoggedUser);
  loggedUser?: User;
  selectedLang$: Observable<string> = this.store.select(selectLang);
  selectedLang?: string;
  selectedLangChip?: Chip;
  rotationAngle: number = 0;
  authFormOpen: boolean = false;

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
            iconPath: this.getFlagIconUrl.transform(flags[langs.indexOf(value)])
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
    this.rotationAngle += this.menuOpen() ? 180 : 180;
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
      this.langChips.push(
        {
          name: `lang.${langs[i]}`,
          identifier: langs[i],
          iconPath: this.getFlagIconUrl.transform(flags[i])
        }
      )
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
    this.authFormOpen = !this.authFormOpen;
  }
}
