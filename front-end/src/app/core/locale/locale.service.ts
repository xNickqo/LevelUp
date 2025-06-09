import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_I18N_LANG, SUPPORTED_LANGS } from '../constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private translate: TranslateService = inject(TranslateService);

  setupAppLanguage(lang?: string): void {
    this.translate.addLangs(SUPPORTED_LANGS);
    if (lang && this.isAvailabeLanguage(lang)) {
      this.translate.use(lang);
    } else if (this.isAvailabeLanguage(this.getNavigatorLanguageCode())) {
      this.translate.use(this.getNavigatorLanguageCode());
    } else {
      this.translate.use(DEFAULT_I18N_LANG);
    }
  }

  private getNavigatorLanguageCode(): string {
    const lastLanguageSubstringIndex = 2;
    return navigator?.language?.substring(0, lastLanguageSubstringIndex);
  }

  private isAvailabeLanguage(lang: string): boolean {
    return SUPPORTED_LANGS.includes(lang);
  }
}
