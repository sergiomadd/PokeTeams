import { TestBed } from '@angular/core/testing';

import { GetPokemonService } from './get-pokemon.service';

describe('GetPokemonService', () => {
  let service: GetPokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPokemonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
