import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { WindowService } from '../../../../core/helpers/window.service';
import { ColorPickerComponent } from './color-picker.component';

@Component({
  template: `
    <app-color-picker
      [colors]="colors"
      [visible]="visible"
      (chooseEvent)="onChoose($event)"
    ></app-color-picker>
  `,
  standalone: true,
  imports: [ColorPickerComponent]
})
class HostComponent 
{
  colors = ['#ff0000', '#00ff00', '#0000ff'];
  visible = false;

  chosenIndex: number | null = null;

  onChoose(index: number) 
  {
    this.chosenIndex = index;
  }
}

describe('ColorPickerComponent', () => {
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let windowService: WindowService;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule(
    {
      imports: [HostComponent,  TranslateModule.forRoot()],
      providers: [
        {
          provide: WindowService,
          useValue: {
            isTabletLandscapeOrLess: () => false
          }
        }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(HostComponent);
    windowService = TestBed.inject(WindowService);    
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should apply visible class when visible=true', () => 
  {
    host.visible = true;
    fixture.detectChanges();

    const picker = fixture.debugElement.query(By.css('.color-picker'));
    expect(picker.nativeElement.classList).toContain('color-picker-visible');
  });

  it('should not have visible class when visible=false', () => 
  {
    host.visible = false;
    fixture.detectChanges();

    const picker = fixture.debugElement.query(By.css('.color-picker'));
    expect(picker.nativeElement.classList).not.toContain('color-picker-visible');
  });

  it('should apply right class when not tablet landscape', () => 
  {
    jest.spyOn(windowService, 'isTabletLandscapeOrLess').mockReturnValue(false);
    fixture.detectChanges();

    const picker = fixture.debugElement.query(By.css('.color-picker'));
    expect(picker.nativeElement.classList).toContain('color-picker-right');
  });

  it('should apply left class when tablet landscape', () => 
  {
    jest.spyOn(windowService, 'isTabletLandscapeOrLess').mockReturnValue(true);
    fixture.detectChanges();

    const picker = fixture.debugElement.query(By.css('.color-picker'));
    expect(picker.nativeElement.classList).toContain('color-picker-left');
  });

  it('should emit chooseEvent with correct index when a color button is clicked', () => 
  {
    const buttons = fixture.debugElement.queryAll(By.css('.color'));
    buttons[1].nativeElement.click();
    fixture.detectChanges();

    expect(host.chosenIndex).toBe(1);
  });
});
