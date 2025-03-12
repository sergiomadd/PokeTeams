import { TestBed } from '@angular/core/testing';

import { LangInterceptorService } from './lang-interceptor.service';

describe('LangInterceptorService', () => {
  let service: LangInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LangInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
