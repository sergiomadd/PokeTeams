import { Component, EventEmitter, inject, Output, input } from '@angular/core';
import { WindowService } from '../../../../core/helpers/window.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrl: './color-picker.component.scss',
    standalone: false
})
export class ColorPickerComponent 
{
  window = inject(WindowService);

  readonly colors = input<string[]>([]);
  readonly visible = input<boolean>(false);
  @Output() chooseEvent = new EventEmitter<number>();

  choose(colorIndex: number)
  {
    this.chooseEvent.emit(colorIndex);
  }
}
