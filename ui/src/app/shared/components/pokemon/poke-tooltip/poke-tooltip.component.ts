import { Component, ElementRef, inject, input, TemplateRef, viewChild } from '@angular/core';
import { WindowService } from '../../../../core/helpers/window.service';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-poke-tooltip',
    templateUrl: './poke-tooltip.component.html',
    styleUrl: './poke-tooltip.component.scss',
    imports: [NgClass, NgTemplateOutlet]
})
export class PokeTooltipComponent 
{
  window = inject(WindowService);

  readonly content = input<TemplateRef<any> | null>(null);
  readonly side = input<string>("left");
  readonly visible = input<boolean>(false);
  readonly mobileChanged = input<boolean>(false);

  readonly pokeTooltip = viewChild<ElementRef>("pokeTooltip");

  ngOnChanges(changes)
  {
    if(this.mobileChanged() && changes['visible'])
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
    const pokeTooltip = this.pokeTooltip();
    const rect: DOMRect = pokeTooltip?.nativeElement.getBoundingClientRect();
    if(rect)
    {
      if(rect.top - 200 < 0)
      {
        pokeTooltip?.nativeElement.classList.remove("mobile")
        pokeTooltip?.nativeElement.classList.add("bottom")
      }
    }
  }

  reset()
  {
    this.pokeTooltip()?.nativeElement.classList.remove("bottom")
    this.pokeTooltip()?.nativeElement.classList.add("mobile")
  }
}
