import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Lang } from '../models/misc/lang.enum';
import { I18nService } from './i18n.service';

// Mock TranslateService
const translateMock = 
{
  addLangs: jest.fn(),
  setFallbackLang: jest.fn(),
  use: jest.fn(),
  instant: jest.fn().mockReturnValue('translated')
};

// Mock Store (NgRx)
const mockStore = 
{
  select: jest.fn().mockReturnValue(of(Lang.en))
};

describe('I18nService', () => 
{
  let service: I18nService;
  let translateService: jest.Mocked<TranslateService>;
  let store: jest.Mocked<Store>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.select.mockReturnValue(of(Lang.en));

    TestBed.configureTestingModule({
      providers: [
        I18nService,
        { provide: TranslateService, useValue: translateMock },
        { provide: Store, useValue: mockStore }
      ]
    });
    translateService = TestBed.inject(TranslateService) as jest.Mocked<TranslateService>;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
    service = TestBed.inject(I18nService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('switchLanguage', () => {
    it('should switch to a valid language and return observable of language', (done) => {
      const language = Lang.en;
      
      service.switchLanguage(language).subscribe(result => {
        expect(result).toBe(language);
        expect(translateService.use).toHaveBeenCalledWith(language);
        done();
      });
    });

    it('should switch to Spanish language successfully', (done) => {
      const language = Lang.es;
      
      service.switchLanguage(language).subscribe(result => {
        expect(result).toBe(language);
        expect(translateService.use).toHaveBeenCalledWith(language);
        done();
      });
    });
  });

  describe('translateKey', () => {
    it('should translate a key using instant method', () => {
      const key = 'test.key';
      const translatedValue = 'Translated Value';
      translateService.instant.mockReturnValue(translatedValue);
      
      const result = service.translateKey(key);
      
      expect(result).toBe(translatedValue);
      expect(translateService.instant).toHaveBeenCalledWith(key);
    });

    it('should handle multiple translation keys', () => {
      const keys = ['key1', 'key2', 'key3'];
      const translations = ['Translation 1', 'Translation 2', 'Translation 3'];
      
      keys.forEach((key, index) => {
        translateService.instant.mockReturnValue(translations[index]);
        const result = service.translateKey(key);
        expect(result).toBe(translations[index]);
      });
      
      expect(translateService.instant).toHaveBeenCalledTimes(3);
    });
  });

  describe('translateKeyWithParameters', () => {
    it('should translate a key with parameters using instant method', () => {
      const key = 'test.key';
      const parameters = { name: 'John', age: 30 };
      const translatedValue = 'Hello John, you are 30 years old';
      translateService.instant.mockReturnValue(translatedValue);
      
      const result = service.translateKeyWithParameters(key, parameters);
      
      expect(result).toBe(translatedValue);
      expect(translateService.instant).toHaveBeenCalledWith(key, parameters);
    });

    it('should handle empty parameters object', () => {
      const key = 'test.key';
      const parameters = {};
      const translatedValue = 'Simple translation';
      translateService.instant.mockReturnValue(translatedValue);
      
      const result = service.translateKeyWithParameters(key, parameters);
      
      expect(result).toBe(translatedValue);
      expect(translateService.instant).toHaveBeenCalledWith(key, parameters);
    });

    it('should handle complex nested parameters', () => {
      const key = 'user.profile';
      const parameters = { 
        user: { name: 'Jane', role: 'Admin' },
        count: 5 
      };
      const translatedValue = 'User Jane (Admin) has 5 items';
      translateService.instant.mockReturnValue(translatedValue);
      
      const result = service.translateKeyWithParameters(key, parameters);
      
      expect(result).toBe(translatedValue);
      expect(translateService.instant).toHaveBeenCalledWith(key, parameters);
    });
  });

  describe('selectedLang$', () => {
    it('should expose the selected language observable', (done) => {
      const testLang = Lang.es;
      mockStore.select.mockReturnValue(of(testLang));
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          I18nService,
          { provide: TranslateService, useValue: translateMock },
          { provide: Store, useValue: mockStore }
        ]
      });
      
      const newService = TestBed.inject(I18nService);
      
      newService.selectedLang$.subscribe(lang => {
        expect(lang).toBe(testLang);
        done();
      });
    });
  });

  describe('selectedLang property', () => {
    it('should be set after subscription to selectedLang$', (done) => {
      const testLang = Lang.es;
      mockStore.select.mockReturnValue(of(testLang));
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          I18nService,
          { provide: TranslateService, useValue: translateMock },
          { provide: Store, useValue: mockStore }
        ]
      });
      
      const newService = TestBed.inject(I18nService);
      
      setTimeout(() => {
        expect(newService.selectedLang).toBe(testLang);
        done();
      }, 0);
    });
  });
});
