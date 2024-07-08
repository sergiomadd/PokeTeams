import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent 
{
  @Input() option?: boolean;
  @Input() obj?: any;
  @Input() objSelector?: string;
  @Input() label?: string;
  @Input() hoverText?: string;
  @Output() checkEvent = new EventEmitter<boolean>();
  checked: boolean = false;

  ngOnChanges()
  {
    if(this.objSelector)
    {
      this.checked = this.obj ? this.obj[this.objSelector] : undefined
    }
  }

  clickEvent()
  {
    this.checked = !this.checked;
    if(this.objSelector)
    {
      this.obj[this.objSelector] = this.checked;
    }
    this.checkEvent.emit(this.checked);
  }
}
