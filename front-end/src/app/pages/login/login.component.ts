import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse } from '@app/core/models/authResponse.model';
import { AuthService } from '@app/core/services/auth.service';
import { delay } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  submitted = signal(false);
  errorMsg = signal<string | null>(null);
  cargando = signal(false);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.submitted.set(true);
    this.errorMsg.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cargando.set(false);
      return;
    }

    const { email, password } = this.form.value;

    this.cargando.set(true);
    this.authService
      .login(email ?? '', password ?? '')
      .pipe(delay(2000))
      .subscribe({
        next: (response: AuthResponse) => {
          console.log('Login exitoso', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(error);
          this.errorMsg.set('Error al iniciar sesión');
          this.cargando.set(false);
        }
      });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
