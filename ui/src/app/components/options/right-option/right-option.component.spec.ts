import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightOptionComponent } from './right-option.component';

describe('RightOptionComponent', () => {
  let component: RightOptionComponent;
  let fixture: ComponentFixture<RightOptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RightOptionComponent]
    });
    fixture = TestBed.createComponent(RightOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
