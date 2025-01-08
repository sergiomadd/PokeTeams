import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-poke-tooltip',
  templateUrl: './poke-tooltip.component.html',
  styleUrl: './poke-tooltip.component.scss'
})
export class PokeTooltipComponent 
{
  @Input() content?: TemplateRef<any>;
  @Input() side: string = "left";
  @Input() visible: boolean = false;
}
