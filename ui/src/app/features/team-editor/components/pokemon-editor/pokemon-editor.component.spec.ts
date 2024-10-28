import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonEditorComponent } from './pokemon-editor.component';

describe('PokemonEditorComponent', () => {
  let component: PokemonEditorComponent;
  let fixture: ComponentFixture<PokemonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
