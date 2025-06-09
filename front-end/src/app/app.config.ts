import { HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { environment } from '@env';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { DEFAULT_I18N_LANG, ENV } from './core/constants/global.constants';
import { apiHeaderInterceptor } from './core/interceptors/api-header.interceptor';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideRouter(routes, withHashLocation(), withViewTransitions()),
    provideHttpClient(withInterceptors([apiHeaderInterceptor])),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: false || 'none' }
      }
    }),
    importProvidersFrom([
      TranslateModule.forRoot({
        defaultLanguage: DEFAULT_I18N_LANG,
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ]),
    { provide: ENV, useValue: environment },
    provideAnimationsAsync()
  ]
};
