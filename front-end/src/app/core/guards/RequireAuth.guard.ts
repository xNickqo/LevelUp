import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/* Redirecciona a la página de inicio de sesión si el usuario no está autenticado */
export const RequireAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuth()) {
    return true;
  } else {
    return router.navigate(['/login']);
  }
};
