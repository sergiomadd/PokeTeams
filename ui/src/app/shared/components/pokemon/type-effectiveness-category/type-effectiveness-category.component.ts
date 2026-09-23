import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Type } from '../../../../core/models/pokemon/type.model';
import { ShouldBeInMiddlePipe } from '../../../pipes/pokemon-pipes/shouldBeInMiddle.pipe';

@Component({
    selector: 'app-type-effectiveness-category',
    templateUrl: './type-effectiveness-category.component.html',
    styleUrl: './type-effectiveness-category.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, ShouldBeInMiddlePipe]
})
export class TypeEffectivenessCategoryComponent
{
  readonly types = input<Type[] | undefined>();
  readonly multiplier = input.required<string>();
}
