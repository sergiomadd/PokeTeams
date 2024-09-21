import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent 
{
  @Input() colors: string[] = [];
  @Output() chooseEvent = new EventEmitter<string>();

  choose(color: string)
  {
    this.chooseEvent.emit(color);
  }
}
