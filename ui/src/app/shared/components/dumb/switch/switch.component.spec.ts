import { Component, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SwitchComponent } from './switch.component';

@Component({
  template: `
    <app-switch
      [inputState]="inputState"
      [leftText]="leftText"
      [rightText]="rightText"
      [leftSVG]="leftSVG"
      [rightSVG]="rightSVG"
      [sizeSVG]="sizeSVG"
      (checkEvent)="onCheck($event)"
    ></app-switch>
  `,
  standalone: true,
  imports: [SwitchComponent]
})
class HostComponent 
{
  inputState = false;
  leftText = 'Off';
  rightText = 'On';
  leftSVG: TemplateRef<any> | null = null;
  rightSVG: TemplateRef<any> | null = null;
  sizeSVG = '16px';

  checkedValue: boolean | null = null;

  onCheck(value: boolean) {
    this.checkedValue = value;
  }
}

describe('SwitchComponent', () => 
{
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => 
  {
    TestBed.configureTestingModule(
    {
      imports: [HostComponent]
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render selector with correct size', () => 
  {
    const selector = fixture.debugElement.query(By.css('.selector.option'));
    expect(selector.styles['width']).toBe(host.sizeSVG);
    expect(selector.styles['height']).toBe(host.sizeSVG);
  });

  it('should apply selectedLeft class when state=false', () => 
  {
    const selector = fixture.debugElement.query(By.css('.selector.option'));
    const switchComp = selector.componentInstance as SwitchComponent;
    switchComp.state = false;
    fixture.detectChanges();

    expect(selector.nativeElement.classList).toContain('selectedLeft');
    expect(selector.nativeElement.classList).not.toContain('selectedRight');
  });

  it('should apply selectedRight class when state=true', () => 
  {
    const selector = fixture.debugElement.query(By.css('.selector.option'));
    const switchComp = selector.componentInstance as SwitchComponent;
    switchComp.state = true;
    fixture.detectChanges();

    expect(selector.nativeElement.classList).toContain('selectedRight');
    expect(selector.nativeElement.classList).not.toContain('selectedLeft');
  });

  it('should display leftText', () => 
  {
    const left = fixture.debugElement.query(By.css('.option.left .option'));
    expect(left.nativeElement.textContent.trim()).toBe(host.leftText);
  });

  it('should display rightText', () => 
  {
    const right = fixture.debugElement.query(By.css('.option.right .option'));
    expect(right.nativeElement.textContent.trim()).toBe(host.rightText);
  });

  it('should emit checkEvent with toggled state when left clicked', () => 
  {
    const leftOption = fixture.debugElement.query(By.css('.option.left'));
    leftOption.nativeElement.click();
    fixture.detectChanges();

    expect(host.checkedValue).toBe(true);
  });

  it('should emit checkEvent with toggled state when right clicked', () => 
  {
    const rightOption = fixture.debugElement.query(By.css('.option.right'));
    rightOption.nativeElement.click();
    fixture.detectChanges();

    expect(host.checkedValue).toBe(true);
  });

  it('should update state when inputState changes', () => 
  {
    host.inputState = true;
    fixture.detectChanges();

    const switchComp = fixture.debugElement.query(By.css('app-switch')).componentInstance as SwitchComponent;
    expect(switchComp.state).toBe(true);

    host.inputState = false;
    fixture.detectChanges();
    expect(switchComp.state).toBe(false);
  });
});
