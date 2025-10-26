import { Component, TemplateRef, input, model, output } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    imports: [NgClass, NgTemplateOutlet, TooltipComponent]
})
export class CheckboxComponent 
{
  checked = model<boolean>(false);
  readonly label = input<string | undefined>("");
  readonly icon = input<string>();
  readonly svg = input<TemplateRef<any> | null>(null);
  readonly tooltipText = input<string>();
  readonly lock = input<boolean>(false);
  readonly checkEvent = output<boolean>();
  
  clickEvent()
  {
    if(!this.lock())
    {
      this.checked.set(this.checked());
    }
    this.checkEvent.emit(this.checked());
  }
}
