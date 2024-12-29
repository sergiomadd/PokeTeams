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
  @Output() checkEvent = new EventEmitter<boolean>();
  
  clickEvent()
  {
    this.checked = !this.checked;
    this.checkEvent.emit(this.checked);
  }
}
