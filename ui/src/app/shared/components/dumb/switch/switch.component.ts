import { Component, EventEmitter, Input, Output, SimpleChanges, TemplateRef } from '@angular/core';

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
  @Input() leftSVG?: TemplateRef<any>;
  @Input() rightSVG?: TemplateRef<any>;
  @Output() checkEvent = new EventEmitter<boolean>();

  state: boolean = false;

  ngOnInit() 
  {
    if(this.inputState) {this.state = this.inputState}
  }

  ngOnChanges(changes: SimpleChanges) 
  {
    if(changes["inputState"]) 
    {
      this.state = changes["inputState"].currentValue
    }
  }

  onClick()
  {
    this.checkEvent.emit(!this.state);
  }
}
