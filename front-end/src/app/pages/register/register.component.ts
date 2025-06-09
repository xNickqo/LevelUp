import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse } from '@app/core/models/authResponse.model';
import { Community } from '@app/core/models/community.model';
import { Country } from '@app/core/models/country.model';
import { Province } from '@app/core/models/province.model';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatSlideToggleModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  submitted = signal(false);
  errorMsg = signal<string>('');

  countries = signal<Country[]>([]);
  communities = signal<Community[]>([]);
  provinces = signal<Province[]>([]);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)
      //Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    isAdmin: new FormControl(false),
    isoCode: new FormControl('', [Validators.required]),
    communityId: new FormControl('', [Validators.required]),
    provinceId: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCountries().subscribe({
      next: (data) => this.countries.set(data),
      error: () => this.errorMsg.set('Error al cargar los países')
    });

    this.isoCode?.valueChanges.subscribe(() => {
      this.communities.set([]);
      this.provinces.set([]);

      this.authService.getCommunities().subscribe({
        next: (data) => this.communities.set(data),
        error: () => this.errorMsg.set('Error al cargar las comunidades')
      });
    });

    this.communityId?.valueChanges.subscribe((communityId) => {
      this.provinces.set([]);

      if (communityId) {
        this.authService.getProvincesByCommunityId(communityId).subscribe({
          next: (data) => this.provinces.set(data),
          error: () => this.errorMsg.set('Error al cargar las provincias')
        });
      }
    });
  }

  onRegister(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.errorMsg.set('Las contraseñas no coinciden');
      return;
    }

    const { name, email, password, isAdmin, isoCode, communityId, provinceId } = this.form.value;

    const role = isAdmin ? 'admin' : 'user';

    this.authService
      .register(name ?? '', email ?? '', password ?? '', role, isoCode ?? '', communityId ?? '', provinceId ?? '')
      .subscribe({
        next: (response: AuthResponse) => {
          console.log('Registro exitoso:', response);
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.errorMsg.set('Error al registrar');
        }
      });
  }

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  get isoCode() {
    return this.form.get('isoCode');
  }

  get communityId() {
    return this.form.get('communityId');
  }

  get provinceId() {
    return this.form.get('provinceId');
  }
}
