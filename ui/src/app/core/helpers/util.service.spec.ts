import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';
import { UtilService } from './util.service';

class MockI18nService {
  translate = {
    instant: (key: string) => key
  };
}

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilService,
        { provide: I18nService, useClass: MockI18nService }
      ]
    });
    service = TestBed.inject(UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('haveMinutesPassed()', () => 
  {
    const minutesToPass = 5 * 60000;
    const timePassed = new Date().getTime() - minutesToPass;
    const timeNotYetPassed = new Date().getTime() + minutesToPass;

    it('should return true', () => 
    {
      expect(service.haveMinutesPassed(timePassed, 5)).toBe(true);
    })

    it('should return false', () => 
    {
      expect(service.haveMinutesPassed(timeNotYetPassed, 5)).toBe(false);
    })
  });

  describe('isNaN()', () => 
  {
    it('should return true', () =>
    {
      expect(service.isNaN("test")).toBe(true);
    })

    it('should return false', () =>
    {
      expect(service.isNaN("100")).toBe(false);
    })
  });

  describe('stringToBoolean()', () => 
  {
    it('should return true', () =>
    {
      expect(service.stringToBoolean("true")).toBe(true);
    });

    it('should return false', () =>
    {
      expect(service.stringToBoolean("false")).toBe(false);
    });

    it('should return undefined', () =>
    {
      expect(service.stringToBoolean("test")).toBe(undefined);
    });

    
  });
});
