import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent 
{
  @Input() checked: boolean = false;
  @Input() label?: string = "";
  @Input() icon?: string;
  @Input() svg?: TemplateRef<any>;
  @Input() tooltipText?: string;
  @Input() lock: boolean = false;
  @Output() checkEvent = new EventEmitter<boolean>();
  
  clickEvent()
  {
    if(!this.lock)
    {
      this.checked = !this.checked;
    }
    this.checkEvent.emit(this.checked);
  }
}
