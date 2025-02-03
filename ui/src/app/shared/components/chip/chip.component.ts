import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { QueryItem } from '../../models/queryResult.model';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent 
{
  themeService = inject(ThemeService);

  @Input() name?: string;
  @Input() iconPath?: string;
  @Input() tooltipText?: string;
  @Input() removable: boolean = false;
  @Input() minWidth?: string;
  @Input() bgColor?: string;
  @Input() textColor?: string;
  @Output() removeEvent = new EventEmitter<QueryItem>()

  getRemoveColor()
  {
    return this.textColor ?? 'var(--text-color)';
  }

  remove()
  {
    this.removeEvent.emit();
  }
}
