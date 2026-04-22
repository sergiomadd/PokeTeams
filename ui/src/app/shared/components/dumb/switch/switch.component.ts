import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, input, output } from '@angular/core';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    imports: [NgStyle, NgClass, NgTemplateOutlet]
})

export class SwitchComponent 
{
  readonly state = input<boolean>(false);
  readonly leftText = input<string>();
  readonly rightText = input<string>();
  readonly leftSVG = input<TemplateRef<any> | null>(null);
  readonly rightSVG = input<TemplateRef<any> | null>(null);
  readonly sizeSVG = input<string>();
  readonly checkEvent = output<boolean>();

  onClick()
  {
    //Se updatea en el parent
    this.checkEvent.emit(!this.state());
  }
}
