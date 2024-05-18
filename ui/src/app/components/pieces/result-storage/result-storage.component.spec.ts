import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultStorageComponent } from './result-storage.component';

describe('ResultStorageComponent', () => {
  let component: ResultStorageComponent;
  let fixture: ComponentFixture<ResultStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultStorageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
