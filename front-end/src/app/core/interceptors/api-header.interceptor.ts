import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Interceptor que añade el header Authorization con el token JWT si el usuario está autenticado
export const apiHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isAuthenticated = authService.isAuth();

  // Si el token y el usuario están autenticados, añade el header Authorization con el token
  if (token && isAuthenticated) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Envía la solicitud modificada
    return next(authReq);
  }

  // Si el token o el usuario no están autenticados, envía la solicitud original
  // Permite que ciertas rutas públicas se llamen aunque el usuario no esté autenticado.
  // Útil si no todas las peticiones requieren token.
  return next(req);
  // return throwError(() => new Error('Petición bloqueada: usuario no autenticado'));
};
