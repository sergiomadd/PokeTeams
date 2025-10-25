import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTranslationComponent } from './no-translation.component';

describe('NoTranslationComponent', () => {
  let component: NoTranslationComponent;
  let fixture: ComponentFixture<NoTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NoTranslationComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(NoTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
