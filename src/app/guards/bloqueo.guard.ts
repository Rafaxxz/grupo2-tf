import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LimiteTiempoService } from '../services/limite-tiempo.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const bloqueoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const limiteSvc = inject(LimiteTiempoService);
  const router = inject(Router);

  if (!auth.isHijo()) return true;

  const userId = auth.getCurrentUserId();
  return limiteSvc.getByUsuario(userId).pipe(
    map((limites: any[]) => {
      const bloqueado = limites.some(l => l.bloqueoActivo === true);
      if (bloqueado) {
        router.navigate(['/bloqueado']);
        return false;
      }
      return true;
    }),
    catchError(() => of(true))
  );
};
