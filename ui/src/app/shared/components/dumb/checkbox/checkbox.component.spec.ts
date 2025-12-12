import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';


@Component({
  template: `
    <app-checkbox
      [label]="label"
      [icon]="icon"
      [tooltipText]="tooltip"
      [lock]="lock"
      [svg]="svgTemplateInput"
      (checkEvent)="onCheck($event)"
    ></app-checkbox>

    <ng-template #svgTmpl>
      <span class="svg-content">SVG</span>
    </ng-template>
  `,
  standalone: true,
  imports: [CheckboxComponent]
})
class HostComponent 
{
  label = 'Test title';
  icon = '';
  tooltip = '';
  lock = false;
    
  @ViewChild('svgTmpl', { static: true })
  svgTemplate!: TemplateRef<any>;
  svgTemplateInput: TemplateRef<any> | null = null;

  emittedValue: boolean | null = null;

  onCheck(value: boolean) 
  {
    this.emittedValue = value;
  }
}

describe('CheckboxComponent', () => 
{
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule(
    {
      imports: [HostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();


    // Reset inputs to default values
    host.icon = '';
    host.label = 'Test title';
    host.tooltip = '';
    host.lock = false;
    host.svgTemplateInput = null;

    // Ensure svg is null
    fixture.componentRef.setInput('svg', null);

    fixture.detectChanges(); // update DOM
  });

  it('should create', () => 
  {
    expect(host).toBeTruthy();
  });

  it('emits new checked value when clicked', () => 
  {
    const mainElement: HTMLElement = fixture.nativeElement.querySelector('.checkbox');
    mainElement.click();
    fixture.detectChanges();
    expect(host.emittedValue).toBe(true);
  });

  it('does not toggle when locked', () => 
  {
    host.lock = true;
    fixture.detectChanges();

    const mainElement: HTMLElement = fixture.nativeElement.querySelector('.checkbox');
    mainElement.click();
    fixture.detectChanges();

    expect(host.emittedValue).toBe(false);
  });

  it('toggles checked border class based on model()', () => 
  {
    const mainElement: HTMLElement = fixture.nativeElement.querySelector('.checkbox');
    expect(mainElement.classList.contains('checked-border')).toBe(false);

    mainElement.click();
    fixture.detectChanges();

    expect(mainElement.classList.contains('checked-border')).toBe(true);
  });

  it('renders label when no icon and no svg', () => 
  {
    host.icon = '';
    fixture.componentRef.setInput('svg', null);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Test title');
  });

  it('renders icon when provided', () => 
  {
    host.icon = 'testIcon';
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.src).toContain('testIcon');
  });

  it('renders svg template when provided', () => 
  {
    host.icon = '';
     host.svgTemplateInput = host.svgTemplate;
    fixture.detectChanges();

    const svgContent = fixture.nativeElement.querySelector('.svg-content');
    expect(svgContent).not.toBeNull();
  });

  it('renders tooltip when tooltipText is set', () => 
  {
    host.tooltip = 'Important info';
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector('app-tooltip');
    expect(tooltip).not.toBeNull();
  });
});
