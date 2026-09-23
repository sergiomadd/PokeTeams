import { Component, inject, input, output, TemplateRef } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { WindowService } from '../../../../core/helpers/window.service';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { PokeTooltipComponent } from '../poke-tooltip/poke-tooltip.component';
import { TypeEffectivenessCategoryComponent } from '../type-effectiveness-category/type-effectiveness-category.component';

export interface TypeBadgeClickEvent
{
  index: number;
  type: string;
}

@Component({
    selector: 'app-pokemon-type-badges',
    templateUrl: './pokemon-type-badges.component.html',
    styleUrl: './pokemon-type-badges.component.scss',
    imports: [NgClass, NgTemplateOutlet, PokeTooltipComponent, TypeEffectivenessCategoryComponent]
})
export class PokemonTypeBadgesComponent
{
  window = inject(WindowService);

  readonly pokemon = input.required<Pokemon>();
  readonly compareTeam = input<string | undefined>();
  readonly tooltipTeraVisible = input<boolean>(false);
  readonly tooltipType1Visible = input<boolean>(false);
  readonly teratypeEnabled = input<boolean>(false);
  readonly errorSvg = input<TemplateRef<unknown> | null>(null);
  readonly sectionClick = output<TypeBadgeClickEvent>();
}
