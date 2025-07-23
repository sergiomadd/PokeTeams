import { TestBed } from '@angular/core/testing';

import { PokemonStatService } from './pokemon-stat.service';

describe('PokemonStatService', () => {
  let service: PokemonStatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonStatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
