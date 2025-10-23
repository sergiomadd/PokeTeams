import { Component, EventEmitter, Output, TemplateRef, input, model } from '@angular/core';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    standalone: false
})
export class CheckboxComponent 
{
  checked = model<boolean>(false);
  readonly label = input<string | undefined>("");
  readonly icon = input<string>();
  readonly svg = input<TemplateRef<any> | null>(null);
  readonly tooltipText = input<string>();
  readonly lock = input<boolean>(false);
  @Output() checkEvent = new EventEmitter<boolean>();
  
  clickEvent()
  {
    if(!this.lock())
    {
      this.checked.set(this.checked());
    }
    this.checkEvent.emit(this.checked());
  }
}
