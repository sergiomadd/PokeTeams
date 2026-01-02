import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipComponent } from './tooltip.component';

@Component({
  template:`
    <app-tooltip
    [text]="text"
    [side]="side"
    [visible]="visible"
    [instant]="instant"
    [loading]="loading"
    [loadingText]="loadingText"
    ></app-tooltip>
  `,
  standalone: true,
  imports: [TooltipComponent]
})
class HostComponent
{
  text = 'Tooltip text';
  side: 'top' | 'right' | 'bottom' | 'left' = 'left';
  visible = false;
  instant = false;
  loading = false;
  loadingText = 'Loading...';
}

function getTooltip(fixture: ComponentFixture<any>) 
{
  return fixture.debugElement.query(By.css('.tooltip'));
}

describe('TooltipComponent', () => 
{
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render tooltip text when not loading', () => 
  {
    host.text = 'Hello tooltip';
    fixture.detectChanges();

    const text = fixture.debugElement.query(By.css('.tooltip .text'));

    expect(text.nativeElement.textContent.trim()).toBe('Hello tooltip');
  });

  it('should hide text when loading=true', () => 
  {
    host.loading = true;
    fixture.detectChanges();

    const text = fixture.debugElement.query(By.css('.tooltip .text'));
    expect(text).toBeNull();
  });

  it('should show loading indicator when loading=true', () => 
  {
    host.loading = true;
    fixture.detectChanges();

    const loader = fixture.debugElement.query(By.css('.tooltip .loading'));
    expect(loader).toBeTruthy();
  });

  it('should render loadingText when loading=true and loadingText exists', () => 
  {
    host.loading = true;
    host.loadingText = 'Please wait';
    fixture.detectChanges();

    const tooltip = getTooltip(fixture);

    expect(tooltip.nativeElement.textContent).toContain('Please wait');
  });

  it('should apply right class when side=right', () => 
  {
    host.side = 'right';
    fixture.detectChanges();

    const tooltip = getTooltip(fixture);

    expect(tooltip.nativeElement.classList).toContain('right');
  });

  it('should apply tooltip-visible class when visible=true', () => 
  {
    host.visible = true;
    fixture.detectChanges();

    const tooltip = getTooltip(fixture);

    expect(tooltip.nativeElement.classList).toContain('tooltip-visible');
  });

  it('should apply transition class when visible=true and instant=false', () => 
  {
    host.visible = true;
    host.instant = false;
    fixture.detectChanges();

    const tooltip = getTooltip(fixture);

    expect(tooltip.nativeElement.classList).toContain('transition');
  });

  it('should not apply transition class when instant=true', () => 
  {
    host.visible = true;
    host.instant = true;
    fixture.detectChanges();

    const tooltip = getTooltip(fixture);

    expect(tooltip.nativeElement.classList).not.toContain('transition');
  });

  it('should apply arrow class for bottom side', () => 
  {
    host.side = 'bottom';
    fixture.detectChanges();

    const arrow = fixture.debugElement.query(By.css('.tooltip span'));

    expect(arrow.nativeElement.classList).toContain('arrowtop');
  });
});
