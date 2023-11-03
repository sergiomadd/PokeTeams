import { TestBed } from '@angular/core/testing';

import { GenerateTeamService } from './generate-team.service';

describe('GenerateTeamService', () => {
  let service: GenerateTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
