import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

@Component({
  selector: 'app-switch',
  template: `
  <label 
  id="switch" 
  class="switch"
  name="switch"
  >
    <input 
    type="checkbox"
    [checked]="state"
    (change)="onChecked()"
    >
    <span class="slider"></span>
  </label>
  <label for="switch">{{label}}</label>
  `,
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent 
{
  @Input() inputState?: boolean;
  @Input() label?: string;

  @Output() checkEvent = new EventEmitter<boolean>();

  state: boolean = false;

  ngOnInit() 
  {
    if(this.inputState) {this.state = this.inputState}
  }

  onChecked()
  {
    this.state = !this.state;
    this.checkEvent.emit(this.state);
  }
}
