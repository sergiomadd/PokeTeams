import { Component, inject, Input, TemplateRef } from '@angular/core';
import { WindowService } from 'src/app/core/layout/mobile/window.service';

@Component({
  selector: 'app-poke-tooltip',
  templateUrl: './poke-tooltip.component.html',
  styleUrl: './poke-tooltip.component.scss'
})
export class PokeTooltipComponent 
{
  window = inject(WindowService);

  @Input() content?: TemplateRef<any>;
  @Input() side: string = "left";
  @Input() visible: boolean = false;
  @Input() mobileChanged: boolean = false;
}
