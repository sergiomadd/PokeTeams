import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { ChipComponent } from './chip.component';

@Component({
  template:`
    <app-chip
      [name]="name"
      [type]="type"
      [iconPath]="iconPath"
      [tooltipText]="tooltipText"
      [removable]="removable"
      [minWidth]="minWidth"
      [bgColor]="bgColor"
      [textColor]="textColor"
      (removeEvent)="remove()"                           
    ></app-chip>
  `,
  standalone: true,
  imports: [ChipComponent]
})
class HostComponent
{
  name = '';
  type = '';
  iconPath = '';
  tooltipText = '';
  removable = false;
  minWidth = '';
  bgColor = '';
  textColor = '';
  
  removed: boolean | null = null;
  remove() 
  {
    this.removed = true;
  }
}

class MockThemeService
{
  
}

describe('ChipComponent', () => {
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
    {
      imports: [HostComponent],
      providers: 
      [
        { provide: ThemeService, useClass: MockThemeService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => 
  {
    expect(host).toBeTruthy();  
  }); 

  it('should display the name', () => 
  {
    let chip = fixture.nativeElement.querySelector('.no-overflow')
    expect(chip).not.toBeNull();
    expect(chip.textContent).not.toBeNull();
    expect(chip.textContent).toBe("  ");

    host.name = 'Test display name';
    fixture.detectChanges();

    chip = fixture.nativeElement.querySelector('.no-overflow')
    expect(chip.classList.contains('tooltip-wrapper')).toBe(false);
    expect(chip.textContent).toContain('Test display name');
  });

  it('should display the icon and be icon-l', () => 
  {
    let elem = fixture.nativeElement.querySelector('img')
    expect(elem).toBeNull();

    host.iconPath = 'testIconPath'
    host.type = "nomove"
    fixture.detectChanges();

    elem = fixture.nativeElement.querySelector('img')
    expect(elem).not.toBeNull();
    
    expect(elem.src).toContain('testIconPath');
    expect(elem.classList.contains("icon-s")).toBe(false);
    expect(elem.classList.contains("icon-l")).toBe(true);
  });

  it('should display the icon and be icon-s', () => 
  {
    let elem = fixture.nativeElement.querySelector('img')
    expect(elem).toBeNull();

    host.iconPath = 'testIconPath'
    host.type = "move"
    fixture.detectChanges();

    elem = fixture.nativeElement.querySelector('img')
    expect(elem).not.toBeNull();
    
    expect(elem.src).toContain('testIconPath');
    expect(elem.classList.contains("icon-s")).toBe(true);
    expect(elem.classList.contains("icon-l")).toBe(false);
  });

  it('should have a tooltip and be a tooltip-wrapper', () => 
  {
    const chip: HTMLElement = fixture.nativeElement.querySelector('.chip')
    expect(chip).not.toBeNull();
    expect(chip.classList.contains('tooltip-wrapper')).toBe(false);

    host.tooltipText = 'Test tooltip'
    fixture.detectChanges();
    
    const tooltip = fixture.nativeElement.querySelector('.tooltip');
    expect(tooltip).not.toBeNull();
    expect(chip.classList.contains('tooltip-wrapper')).toBe(true);
  });

  it('should have background color', () => 
  {
    const chip: HTMLElement = fixture.nativeElement.querySelector('.chip')
    expect(chip).not.toBeNull();
    expect(chip.style.backgroundColor).toBe('');

    host.bgColor = 'red'
    fixture.detectChanges();

    expect(chip.style.backgroundColor).toBe('red');
  });

  it('should have minWidth', () => 
  {
    const chip: HTMLElement = fixture.nativeElement.querySelector('.chip')
    expect(chip).not.toBeNull();
    expect(chip.style.minWidth).toBe('');

    host.minWidth = '20px'
    fixture.detectChanges();

    expect(chip.style.minWidth).toBe('20px');
  });

  it('should be removable', () => 
  {
    const notRemove: HTMLElement = fixture.nativeElement.querySelector('.remove')
    expect(notRemove).toBeNull();

    host.removable = true;
    fixture.detectChanges();

    const remove: HTMLElement = fixture.nativeElement.querySelector('.remove')
    expect(remove).not.toBeNull();

    // Spy on HostComponent.remove()
    const spy = jest.spyOn(host, 'remove');

    // Act - click the remove button
    const removeBtn = fixture.nativeElement.querySelector('.remove');
    expect(removeBtn).toBeTruthy();

    removeBtn.click();
    fixture.detectChanges();

    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(host.removed).toBe(true);
  });
});
