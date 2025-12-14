import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Chip } from '../../../../core/models/misc/chip.model';
import { DropdownComponent } from './dropdown.component';

@Component({
  template: `
    <app-dropdown
    [options]="options"
    [selectedOption]="selectedOption"
    [onlyIcon]="onlyIcon"
    [disable]="disable"
    (selectEvent)="onSelect($event)"
    ></app-dropdown>
  `,
  imports: [DropdownComponent],
  standalone: true
})
class HostComponent
{
  options: Chip[] = [];
  selectedOption: Chip | null = null;
  onlyIcon = false;
  disable = false;

  emittedValue: Chip | null = null;
  onSelect(option)
  {
    this.emittedValue = option;
  }
}

describe('DropdownComponent (Host)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const mockOptions: Chip[] = [
    { name: 'Option 1', iconPath: 'icon1.svg' } as Chip,
    { name: 'Option 2', iconPath: 'icon2.svg' } as Chip
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;

    host.options = mockOptions;
    host.selectedOption = mockOptions[0];

    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(host).toBeTruthy();
  });

  it('should render the selected option', () => 
  {
    const selected = fixture.debugElement.query(
      By.css('.option.selected')
    );

    expect(selected.nativeElement.textContent).toContain('Option 1');
  });

  it('should toggle options when selector is clicked', () => 
  {
    const selector = fixture.debugElement.query(
      By.css('.selector')
    );

    selector.nativeElement.click();
    fixture.detectChanges();

    const optionsContainer = fixture.debugElement.query(
      By.css('.options.options-visible')
    );

    expect(optionsContainer).toBeTruthy();
  });

  it('should render all dropdown options', () => 
  {
    const selector = fixture.debugElement.query(By.css('.selector'));
    selector.nativeElement.click();
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(
      By.css('.options .option')
    );

    expect(options.length).toBe(2);
  });

  it('should emit selected option when clicked', () => 
  {
    const selector = fixture.debugElement.query(By.css('.selector'));
    selector.nativeElement.click();
    fixture.detectChanges();

    const option = fixture.debugElement.queryAll(
      By.css('.options .option')
    )[1];

    option.nativeElement.click();
    fixture.detectChanges();

    expect(host.emittedValue).toEqual(mockOptions[1]);
  });

  it('should close dropdown after selecting an option', () => 
  {
    const selector = fixture.debugElement.query(By.css('.selector'));
    selector.nativeElement.click();
    fixture.detectChanges();

    const option = fixture.debugElement.queryAll(
      By.css('.options .option')
    )[0];

    option.nativeElement.click();
    fixture.detectChanges();

    const optionsContainer = fixture.debugElement.query(
      By.css('.options.options-visible')
    );

    expect(optionsContainer).toBeNull();
  });

  it('should apply disabled class when disable=true', () => 
  {
    host.disable = true;
    fixture.detectChanges();

    const dropdown = fixture.debugElement.query(
      By.css('.dropdown')
    );

    expect(dropdown.nativeElement.classList).toContain('disabled');
  });

  it('should apply only-icon class when onlyIcon=true', () => 
  {
    host.onlyIcon = true;
    fixture.detectChanges();

    const selector = fixture.debugElement.query(
      By.css('.selector')
    );

    expect(selector.nativeElement.classList).toContain('only-icon-options');
  });
});

