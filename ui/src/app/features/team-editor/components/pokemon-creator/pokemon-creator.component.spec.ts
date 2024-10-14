import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCreatorComponent } from './pokemon-creator.component';

describe('PokemonCreatorComponent', () => {
  let component: PokemonCreatorComponent;
  let fixture: ComponentFixture<PokemonCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
