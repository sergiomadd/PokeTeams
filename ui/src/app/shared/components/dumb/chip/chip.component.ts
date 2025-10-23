import { Component, EventEmitter, inject, Output, input } from '@angular/core';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { QueryItem } from '../../../../core/models/misc/queryResult.model';

@Component({
    selector: 'app-chip',
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
    standalone: false
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
  @Output() removeEvent = new EventEmitter<QueryItem>()

  getRemoveColor()
  {
    return this.textColor() ?? 'var(--text-color)';
  }

  remove()
  {
    this.removeEvent.emit();
  }
}
