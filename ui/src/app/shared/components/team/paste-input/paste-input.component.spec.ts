import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasteInputComponent } from './paste-input.component';

describe('PasteInputComponent', () => {
  let component: PasteInputComponent;
  let fixture: ComponentFixture<PasteInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PasteInputComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(PasteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
