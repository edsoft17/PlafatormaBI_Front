import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { permissionsInterceptor } from './core/interceptors/permissions.interceptor';
import { provideIP } from '@shared/services/ip.provider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideToastr } from 'ngx-toastr';
import { MatPaginatorIntl, MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorDefaultOptions } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from '@shared/utils/paginator';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideHttpClient(withInterceptors([permissionsInterceptor])), 
    provideAnimationsAsync(),
    importProvidersFrom(MatProgressSpinnerModule),
    importProvidersFrom(RecaptchaV3Module),
    provideIP(),
    provideToastr(),
    {
      provide: MatPaginatorIntl,
      useValue: getSpanishPaginatorIntl()
    },
    // Opcional: Configuración adicional del paginador
    {
      provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
      useValue: {
        pageSize: 10,
        pageSizeOptions: [5, 10, 25, 100],
        showFirstLastButtons: true
      } as MatPaginatorDefaultOptions,
      
    },
    { provide: LOCALE_ID, useValue: 'es-PE' }]
};
