import { TestBed } from '@angular/core/testing';

import { TeamCompareService } from './team-compare.service';

describe('TeamCompareService', () => {
  let service: TeamCompareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamCompareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
