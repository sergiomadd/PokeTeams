import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VgcComponent } from './vgc.component';

describe('VgcComponent', () => {
  let component: VgcComponent;
  let fixture: ComponentFixture<VgcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VgcComponent]
    });
    fixture = TestBed.createComponent(VgcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
