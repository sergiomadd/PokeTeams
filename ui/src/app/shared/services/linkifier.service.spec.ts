import { TestBed } from '@angular/core/testing';

import { LinkifierService } from './linkifier.service';

describe('LinkifierService', () => {
  let service: LinkifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
