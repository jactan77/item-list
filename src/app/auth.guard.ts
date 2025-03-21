import {inject} from '@angular/core';
import {AuthService} from './shared/services/auth.service';
import {Router} from '@angular/router';
import {filter, map, Observable, take} from 'rxjs';

export const authGuard=() =>{
  const authService = inject(AuthService);
  const getToken = authService.getIdToken();
  const router = inject(Router);
  return authService.getIdToken().pipe(
    filter((token) => token !== undefined),
    take(1),
    map((token) => {
      if (!token) {

        return router.createUrlTree(['/login']);
      }
      return true;
    })
  );
}
