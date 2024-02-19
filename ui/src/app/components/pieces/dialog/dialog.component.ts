import { Component, EventEmitter, Input, Output, input } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent 
{
  @Input() title?: string;
  @Input() body?: string;
  @Input() trueButtonText?: string;
  @Input() falseButtonText?: string;
  @Input() visible?: boolean;
  @Output() choose = new EventEmitter<boolean>();

  accept()
  {
    this.choose.emit(true);
  }

  decline()
  {
    this.choose.emit(false);
  }
}
