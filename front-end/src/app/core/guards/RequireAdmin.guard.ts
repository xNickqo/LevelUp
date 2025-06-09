import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivateFn, Router } from '@angular/router';
import { AccessDeniedComponent } from '@app/common/components/access-denied/access-denied.component';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../models/tokenPayload.model';
import { AuthService } from '../services/auth.service';

/* Redirecciona a la página de inicio de sesión si el usuario no está autenticado o no es un admin */
export const RequireAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  const token = authService.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = jwtDecode<TokenPayload>(token);
    const isAdmin = payload.role === 'admin';
    if (!isAdmin) {
      dialog.open(AccessDeniedComponent);
      router.navigate(['/']);
    }
    return isAdmin;
  } catch (error) {
    console.error('Error decodificando token', error);
    router.navigate(['/login']);
    return false;
  }
};
