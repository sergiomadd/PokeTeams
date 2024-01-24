import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopOptionComponent } from './top-option.component';

describe('TopOptionComponent', () => {
  let component: TopOptionComponent;
  let fixture: ComponentFixture<TopOptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopOptionComponent]
    });
    fixture = TestBed.createComponent(TopOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
