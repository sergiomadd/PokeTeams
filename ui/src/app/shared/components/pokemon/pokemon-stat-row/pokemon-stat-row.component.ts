import { AsyncPipe, NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { NatureColors } from '../../../../core/models/misc/colors';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { Stat } from '../../../../core/models/pokemon/stat.model';
import { TeamOptions } from '../../../../core/models/team/teamOptions.model';
import { selectLang } from '../../../../core/store/config/config.selectors';
import { GetStatColorPipe } from '../../../pipes/color-pipes/getStatColor.pipe';
import { GetStatCodePipe } from '../../../pipes/converters/getStatCode.pipe';
import { GetStatShortIdentifierPipe } from '../../../pipes/converters/getStatShortIdentifier.pipe';
import { GetPokemonStatBorderRadiusPipe } from '../../../pipes/pokemon-pipes/getPokemonStatBorderRadius.pipe';
import { GetPokemonStatSizePipe } from '../../../pipes/pokemon-pipes/getPokemonStatSize.pipe';
import { NoTranslationComponent } from '../../dumb/no-translation/no-translation.component';
import { PokeTooltipComponent } from '../poke-tooltip/poke-tooltip.component';

@Component({
    selector: 'app-pokemon-stat-row',
    templateUrl: './pokemon-stat-row.component.html',
    styleUrl: './pokemon-stat-row.component.scss',
    imports: [NgClass, NgStyle, NgTemplateOutlet, AsyncPipe, TranslatePipe, PokeTooltipComponent, NoTranslationComponent, GetStatColorPipe, GetStatCodePipe, GetStatShortIdentifierPipe, GetPokemonStatSizePipe, GetPokemonStatBorderRadiusPipe]
})
export class PokemonStatRowComponent
{
  theme = inject(ThemeService);
  window = inject(WindowService);
  store = inject(Store);

  readonly pokemon = input.required<Pokemon>();
  readonly teamOptions = input<TeamOptions | undefined>();
  readonly stat = input.required<Stat>();
  readonly index = input.required<number>();
  readonly tooltipVisible = input<boolean>(false);
  readonly compareTeam = input<string | undefined>();
  readonly statClick = output<void>();

  readonly natureColors = NatureColors;
  selectedLang$: Observable<string> = this.store.select(selectLang);
}
