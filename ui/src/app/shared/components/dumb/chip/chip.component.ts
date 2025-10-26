import { Component, inject, input, output } from '@angular/core';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { NgClass, NgStyle } from '@angular/common';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
    selector: 'app-chip',
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
    imports: [NgClass, NgStyle, TooltipComponent]
})
export class ChipComponent 
{
  themeService = inject(ThemeService);

  readonly name = input<string>();
  readonly type = input<string>();
  readonly iconPath = input<string>();
  readonly tooltipText = input<string>();
  readonly removable = input<boolean>(false);
  readonly minWidth = input<string>();
  readonly bgColor = input<string>();
  readonly textColor = input<string>();
  readonly removeEvent = output();

  getRemoveColor()
  {
    return this.textColor() ?? 'var(--text-color)';
  }

  remove()
  {
    // TODO: The 'emit' function requires a mandatory QueryItem argument
    this.removeEvent.emit();
  }
}
