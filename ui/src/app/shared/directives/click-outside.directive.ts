import { Directive, ElementRef, inject, Renderer2, output } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective 
{
  element = inject(ElementRef);
  private renderer = inject(Renderer2);

  readonly outSideClick = output<void>();

  private listener: (() => void) | undefined;

  onDocumentClick = (event: Event) => 
  {
    if (!this.element.nativeElement.parentElement.contains(event.target)) 
    {
      this.outSideClick.emit();
    }
  };

 //Add the listener when the dropdown component is rendered
  ngOnInit(): void 
  {
    this.listener = this.renderer.listen(
      'document',
      'click',
      this.onDocumentClick
    );
  }

  //To reduce unnecessary memory leaks you need to use the clean-up
  ngOnDestroy(): void 
  {
    if (this.listener) 
    {
      this.listener();
    }
  }
}
