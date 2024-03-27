import { Directive, ElementRef, Input, NgZone } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent, switchMap } from 'rxjs';

@UntilDestroy()
@Directive(
  {
  selector: '[copy]'
})
export class CopyDirective 
{
  @Input() copy!: string;

  constructor(
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) {}

  ngOnInit() 
  {
    this.zone.runOutsideAngular(() => 
    {
      fromEvent(this.host.nativeElement, 'click').pipe(
        switchMap(() => 
        {
          return navigator.clipboard.writeText(this.copy)
        }),
        untilDestroyed(this)
      ).subscribe();
    })
  }
}