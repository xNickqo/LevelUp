/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from './locale.service';
import { DEFAULT_I18N_LANG, SUPPORTED_LANGS } from '../constants/global.constants';

describe('LocaleService', () => {
  let service: LocaleService;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TranslateService', ['use']);

    TestBed.configureTestingModule({
      providers: [LocaleService, { provide: TranslateService, useValue: spy }]
    });

    service = TestBed.inject(LocaleService);
    translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should use the provided language if it is available', () => {
    const lang = SUPPORTED_LANGS[0];
    service.setupAppLanguage(lang);
    expect(translateServiceSpy.use).toHaveBeenCalledWith(lang);
  });

  it('should use navigator language if provided language is not available', () => {
    const lang = 'unavailableLang';
    spyOn(service as any, 'getNavigatorLanguageCode').and.returnValue(SUPPORTED_LANGS[1]);
    service.setupAppLanguage(lang);
    expect(translateServiceSpy.use).toHaveBeenCalledWith(SUPPORTED_LANGS[1]);
  });

  it('should use default language if neither provided nor navigator languages are available', () => {
    const lang = 'unavailableLang';
    spyOn(service as any, 'getNavigatorLanguageCode').and.returnValue('unavailableLang');
    service.setupAppLanguage(lang);
    expect(translateServiceSpy.use).toHaveBeenCalledWith(DEFAULT_I18N_LANG);
  });

  it('should use navigator language if no language is provided', () => {
    spyOn(service as any, 'getNavigatorLanguageCode').and.returnValue(SUPPORTED_LANGS[1]);
    service.setupAppLanguage();
    expect(translateServiceSpy.use).toHaveBeenCalledWith(SUPPORTED_LANGS[1]);
  });

  it('should use default language if no language is provided and navigator language is unavailable', () => {
    spyOn(service as any, 'getNavigatorLanguageCode').and.returnValue('unavailableLang');
    service.setupAppLanguage();
    expect(translateServiceSpy.use).toHaveBeenCalledWith(DEFAULT_I18N_LANG);
  });
});
