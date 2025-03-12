import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeTooltipComponent } from './poke-tooltip.component';

describe('PokeTooltipComponent', () => {
  let component: PokeTooltipComponent;
  let fixture: ComponentFixture<PokeTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokeTooltipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokeTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
