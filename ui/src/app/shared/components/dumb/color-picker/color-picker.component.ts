import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { WindowService } from 'src/app/core/helpers/window.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent 
{
  window = inject(WindowService);

  @Input() colors: string[] = [];
  @Input() visible: boolean = false;
  @Output() chooseEvent = new EventEmitter<number>();

  choose(colorIndex: number)
  {
    this.chooseEvent.emit(colorIndex);
  }
}
