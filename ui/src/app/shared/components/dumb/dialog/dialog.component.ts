import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    standalone: false
})
export class DialogComponent 
{
  readonly title = input<string>();
  readonly body = input<string>();
  readonly trueButtonText = input<string>();
  readonly falseButtonText = input<string>();
  readonly visible = input<boolean>();
  readonly choose = output<boolean>();

  accept()
  {
    this.choose.emit(true);
  }

  decline()
  {
    this.choose.emit(false);
  }
}
