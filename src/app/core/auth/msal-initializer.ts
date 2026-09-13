import { MsalService } from '@azure/msal-angular';
import { firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * msal-browser exige inicializar la instancia antes de usarla. Se registra como
 * APP_INITIALIZER para que el router (y sus guards) no arranque hasta que MSAL haya
 * procesado la respuesta de un eventual redirect de login.
 */
export function initializeMsalFactory(msalService: MsalService): () => Promise<void> {
  return () =>
    firstValueFrom(msalService.initialize().pipe(switchMap(() => msalService.handleRedirectObservable())))
      .then(() => undefined)
      .catch(() => undefined);
}
