import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaTypeComponent } from './meta-type.component';

describe('MetaTypeComponent', () => {
  let component: MetaTypeComponent;
  let fixture: ComponentFixture<MetaTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetaTypeComponent]
    });
    fixture = TestBed.createComponent(MetaTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
