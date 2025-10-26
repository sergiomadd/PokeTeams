import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonIconsComponent } from './pokemon-icons.component';

describe('PokemonIconsComponent', () => {
  let component: PokemonIconsComponent;
  let fixture: ComponentFixture<PokemonIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PokemonIconsComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
