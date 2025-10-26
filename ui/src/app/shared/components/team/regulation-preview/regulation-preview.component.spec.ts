import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulationPreviewComponent } from './regulation-preview.component';

describe('RegulationPreviewComponent', () => {
  let component: RegulationPreviewComponent;
  let fixture: ComponentFixture<RegulationPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RegulationPreviewComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(RegulationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
