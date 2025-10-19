import { Component, ElementRef, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { WindowService } from '../../../../core/helpers/window.service';

@Component({
    selector: 'app-poke-tooltip',
    templateUrl: './poke-tooltip.component.html',
    styleUrl: './poke-tooltip.component.scss',
    standalone: false
})
export class PokeTooltipComponent 
{
  window = inject(WindowService);

  @Input() content?: TemplateRef<any>;
  @Input() side: string = "left";
  @Input() visible: boolean = false;
  @Input() mobileChanged: boolean = false;

  @ViewChild("pokeTooltip") pokeTooltip?: ElementRef;

  ngOnChanges(changes)
  {
    if(this.mobileChanged && changes['visible'])
    {
      if(changes['visible'].currentValue)
      {
        this.checkOutofViewport()
      }
      else
      {
        this.reset();
      }
    }
  }

  checkOutofViewport()
  {
    const rect: DOMRect = this.pokeTooltip?.nativeElement.getBoundingClientRect();
    if(rect)
    {
      if(rect.top - 200 < 0)
      {
        this.pokeTooltip?.nativeElement.classList.remove("mobile")
        this.pokeTooltip?.nativeElement.classList.add("bottom")
      }
    }
  }

  reset()
  {
    this.pokeTooltip?.nativeElement.classList.remove("bottom")
    this.pokeTooltip?.nativeElement.classList.add("mobile")
  }
}
