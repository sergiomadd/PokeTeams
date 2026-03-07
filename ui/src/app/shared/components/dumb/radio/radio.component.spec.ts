import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, TemplateRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RadioComponent } from './radio.component';

@Component({
  template: `
    <app-radio
      [options]="options"
      [optionNames]="optionNames"
      [optionIcons]="optionIcons"
      [optionSVGs]="optionSVGs"
      [tooltipTexts]="tooltipTexts"
      (selectEvent)="onSelect($event)"
    ></app-radio>
  `,
  standalone: true,
  imports: [RadioComponent]
})
class HostComponent 
{
  options = ['opt1', 'opt2', 'opt3'];
  optionNames = ['Option 1', 'Option 2', 'Option 3'];
  optionIcons: string[] = ['icon1.svg', '', ''];
  optionSVGs: TemplateRef<any>[] = [];
  tooltipTexts: string[] = ['Tooltip 1', 'Tooltip 2', 'Tooltip 3'];

  selectedOption: any = null;

  onSelect(option: any) 
  {
    this.selectedOption = option;
  }
}

describe('RadioComponent', () => 
{
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule(
    {
      imports: [HostComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render all radio options', () => 
  {
    const options = fixture.debugElement.queryAll(By.css('.option'));
    expect(options.length).toBe(host.options.length);
  });

  it('should render option name when no icon or SVG', () => 
  {
    const options = fixture.debugElement.queryAll(By.css('.option'));
    expect(options[1].nativeElement.textContent).toContain('Option 2');
    expect(options[2].nativeElement.textContent).toContain('Option 3');
  });

  it('should render option icons', () => 
  {
    const icon = fixture.debugElement.query(By.css('.option img.big-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.getAttribute('src')).toBe('icon1.svg');
  });

  it('should render tooltip text if provided', () => 
  {
    const tooltip = fixture.debugElement.query(By.css('app-tooltip'));
    expect(tooltip).toBeTruthy();
    expect(tooltip.componentInstance.text()).toBe('Tooltip 1');
  });

  //Selection

  it('should have no selected option initially', () => 
  {
    const selected = fixture.debugElement.queryAll(By.css('.selected-background, .selected-border'));
    expect(selected.length).toBe(0);
  });

  it('should select an option when clicked and emit selectEvent', () => 
  {
    const options = fixture.debugElement.queryAll(By.css('.option'));
    options[1].nativeElement.click();
    fixture.detectChanges();

    expect(host.selectedOption).toBe(host.options[1]);
  });

  it('should apply selected-border if option has icon or SVG', () =>  
  {
    const options = fixture.debugElement.queryAll(By.css('.option'));
    options[0].nativeElement.click();
    fixture.detectChanges();

    expect(options[0].nativeElement.classList).toContain('selected-border');
  });

  it('should apply selected-background if option has no icon or SVG', () => 
  {
    const options = fixture.debugElement.queryAll(By.css('.option'));
    options[1].nativeElement.click();
    fixture.detectChanges();

    expect(options[1].nativeElement.classList).toContain('selected-background');
  });
});
