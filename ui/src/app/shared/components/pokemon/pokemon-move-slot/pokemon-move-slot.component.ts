import { AsyncPipe, NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, output, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { ProcessedString } from '../../../../core/models/misc/processedString.model';
import { Move } from '../../../../core/models/pokemon/move.model';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { selectLang } from '../../../../core/store/config/config.selectors';
import { GetMoveColorPipe } from '../../../pipes/color-pipes/getMoveColor.pipe';
import { GetTypeColorPipe } from '../../../pipes/color-pipes/getTypeColor.pipe';
import { NoTranslationComponent } from '../../dumb/no-translation/no-translation.component';
import { PokeTooltipComponent } from '../poke-tooltip/poke-tooltip.component';
import { PokemonProseComponent } from '../pokemon-prose/pokemon-prose.component';
import { TypeEffectivenessCategoryComponent } from '../type-effectiveness-category/type-effectiveness-category.component';

export interface MoveSectionClickEvent
{
  index: number;
  type: string;
  event?: Event;
}

@Component({
    selector: 'app-pokemon-move-slot',
    templateUrl: './pokemon-move-slot.component.html',
    styleUrl: './pokemon-move-slot.component.scss',
    imports: [NgClass, NgStyle, NgTemplateOutlet, AsyncPipe, TranslatePipe, PokeTooltipComponent, NoTranslationComponent, PokemonProseComponent, TypeEffectivenessCategoryComponent, GetTypeColorPipe, GetMoveColorPipe]
})
export class PokemonMoveSlotComponent
{
  theme = inject(ThemeService);
  window = inject(WindowService);
  store = inject(Store);

  readonly move = input.required<Move>();
  readonly index = input.required<number>();
  readonly pokemon = input.required<Pokemon>();
  readonly tooltipVisible = input<boolean>(false);
  readonly tooltipTypeVisible = input<boolean>(false);
  readonly tooltipClassVisible = input<boolean>(false);
  readonly moveEffectShort = input<ProcessedString[]>([]);
  readonly moveTarget = input<ProcessedString[]>([]);
  readonly compareTeam = input<string | undefined>();
  readonly errorSvg = input<TemplateRef<unknown> | null>(null);
  readonly sectionClick = output<MoveSectionClickEvent>();

  selectedLang$: Observable<string> = this.store.select(selectLang);
}
