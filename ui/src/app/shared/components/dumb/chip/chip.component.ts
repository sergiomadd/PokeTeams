import { NgClass, NgStyle } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
    selector: 'app-chip',
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
    imports: [NgClass, NgStyle, TooltipComponent]
})
export class ChipComponent 
{
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
    this.removeEvent.emit();
  }
}
