import { Component, inject, input, output } from '@angular/core';
import { WindowService } from '../../../../core/helpers/window.service';
import { NgClass, NgStyle } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrl: './color-picker.component.scss',
    imports: [NgClass, NgStyle, TranslatePipe]
})
export class ColorPickerComponent 
{
  window = inject(WindowService);

  readonly colors = input<string[]>([]);
  readonly visible = input<boolean>(false);
  readonly chooseEvent = output<number>();

  choose(colorIndex: number)
  {
    this.chooseEvent.emit(colorIndex);
  }
}
