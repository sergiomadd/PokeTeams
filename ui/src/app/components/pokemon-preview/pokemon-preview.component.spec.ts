import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonPreviewComponent } from './pokemon-preview.component';

describe('PokemonPreviewComponent', () => {
  let component: PokemonPreviewComponent;
  let fixture: ComponentFixture<PokemonPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PokemonPreviewComponent]
    });
    fixture = TestBed.createComponent(PokemonPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
