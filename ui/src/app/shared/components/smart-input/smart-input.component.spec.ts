import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartInputComponent } from './smart-input.component';

describe('SmartInputComponent', () => {
  let component: SmartInputComponent;
  let fixture: ComponentFixture<SmartInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SmartInputComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(SmartInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
