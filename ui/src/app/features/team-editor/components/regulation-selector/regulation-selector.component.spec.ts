import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulationSelectorComponent } from './regulation-selector.component';

describe('RegulationSelectorComponent', () => {
  let component: RegulationSelectorComponent;
  let fixture: ComponentFixture<RegulationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegulationSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegulationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
