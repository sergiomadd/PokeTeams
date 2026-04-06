import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DialogComponent } from './dialog.component';

@Component({
  template: `
    <app-dialog
      [title]="title"
      [body]="body"
      [trueButtonText]="trueButtonText"
      [falseButtonText]="falseButtonText"
      [visible]="visible"
      (choose)="onChoose($event)"
    ></app-dialog>
  `,
  standalone: true,
  imports: [DialogComponent]
})
class HostComponent 
{
  title = 'Confirm Action';
  body = 'Are you sure you want to proceed?';
  trueButtonText = 'No';
  falseButtonText = 'Yes';
  visible = true;

  chosenValue: boolean | null = null;

  onChoose(value: boolean) 
  {
    this.chosenValue = value;
  }
}


describe('DialogComponent', () => 
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

  //Render

  it('should render title', () => 
  {
    const titleEl = fixture.debugElement.query(By.css('.dialog .title'));
    expect(titleEl.nativeElement.textContent.trim()).toBe(host.title);
  });

  it('should render body', () => 
  {
    const bodyEl = fixture.debugElement.query(By.css('.dialog .body'));
    expect(bodyEl.nativeElement.textContent.trim()).toBe(host.body);
  });

  it('should render trueButtonText on decline button', () => 
  {
    const declineBtn = fixture.debugElement.query(By.css('.button.button-primary'));
    expect(declineBtn.nativeElement.textContent.trim()).toBe(host.trueButtonText);
  });

  it('should render falseButtonText on accept button', () => 
  {
    const acceptBtn = fixture.debugElement.query(By.css('.button.button-primary-clear'));
    expect(acceptBtn.nativeElement.textContent.trim()).toBe(host.falseButtonText);
  });

  //Click

  it('should emit false when decline button clicked', () => 
  {
    const declineBtn = fixture.debugElement.query(By.css('.button.button-primary'));
    declineBtn.nativeElement.click();
    fixture.detectChanges();

    expect(host.chosenValue).toBe(false);
  });

  it('should emit true when accept button clicked', () => 
  {
    const acceptBtn = fixture.debugElement.query(By.css('.button.button-primary-clear'));
    acceptBtn.nativeElement.click();
    fixture.detectChanges();

    expect(host.chosenValue).toBe(true);
  });
});
