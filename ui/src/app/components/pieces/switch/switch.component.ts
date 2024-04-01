import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent 
{
  @Input() inputState?: boolean;
  @Input() leftText?: string;
  @Input() rightText?: string;

  @Output() checkEvent = new EventEmitter<boolean>();

  state: boolean = false;

  ngOnInit() 
  {
    if(this.inputState) {this.state = this.inputState}
  }

  onClick()
  {
    this.state = !this.state;
    this.checkEvent.emit(this.state);
    console.log("click event")
  }
}
