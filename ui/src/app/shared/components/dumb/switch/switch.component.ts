import { Component, EventEmitter, Output, SimpleChanges, TemplateRef, input } from '@angular/core';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    standalone: false
})
export class SwitchComponent 
{
  readonly inputState = input<boolean>();
  readonly leftText = input<string>();
  readonly rightText = input<string>();
  readonly leftSVG = input<TemplateRef<any> | null>(null);
  readonly rightSVG = input<TemplateRef<any> | null>(null);
  readonly sizeSVG = input<string>();
  @Output() checkEvent = new EventEmitter<boolean>();

  state: boolean = false;

  ngOnInit() 
  {
    const inputState = this.inputState();
    if(inputState) {this.state = inputState}
  }

  ngOnChanges(changes: SimpleChanges) 
  {
    if(changes["inputState"] && changes["inputState"].currentValue !== changes["inputState"].previousValue) 
    {
      this.state = changes["inputState"].currentValue
    }
  }

  onClick()
  {
    this.checkEvent.emit(!this.state);
  }
}
