import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { ENV } from '../constants/global.constants';
import { AuthResponse } from '../models/authResponse.model';
import { Community } from '../models/community.model';
import { Country } from '../models/country.model';
import { Province } from '../models/province.model';
import { TokenPayload } from '../models/tokenPayload.model';
import { User } from '../models/user.model';
import { Env } from '../types/env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private auth: Auth = inject(Auth);
  private currentUser: User | null = null;

  readonly authState$ = authState(this.auth);

  constructor(private httpClient: HttpClient, private router: Router, @Inject(ENV) private env: Env) {}

  async loginWithGoogle(): Promise<void> {
    try {
      // 1. Inicia sesión con Google
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      // 2. Obtén el token de ID
      const idToken = await result.user.getIdToken();

      // 3. Enviar el token al backend y almacenar el token JWT recibido
      const response = await firstValueFrom(
        this.httpClient.post<AuthResponse>(`${this.env.apiBaseUrl}/auth/firebase-login`, { idToken })
      );

      // 4. Si el backend devuelve un token, guárdalo en el almacenamiento local
      if (response?.token) {
        this.setToken(response.token);
        this.setCurrentUser(response.user);
        this.router.navigate(['/']);
      }
    } catch (err) {
      console.error('Google Sign-in error:', err);
    }
  }

  /**
   * Registra un nuevo usuario enviando los datos al servidor.
   * @param name Nombre completo del usuario.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @param role Rol del usuario (por ejemplo, 'admin', 'user').
   * @param isoCode Código ISO del país del usuario.
   * @param communityId ID de la comunidad a la que pertenece el usuario.
   * @param provinceId ID de la provincia a la que pertenece el usuario.
   * @returns Observable con la respuesta del servidor que incluye el token de autenticación.
   */
  register(
    name: string,
    email: string,
    password: string,
    role: string,
    isoCode: string,
    communityId: string,
    provinceId: string
  ): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.env.apiBaseUrl}/auth/signup`, {
        name,
        email,
        password,
        role,
        isoCode,
        communityId,
        provinceId
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.setToken(response.token);
            this.setCurrentUser(response.user);
            this.router.navigate(['/']);
          }
        })
      );
  }

  /**
   * Inicia sesión con el email y la contraseña proporcionados.
   * Realiza una petición POST al servidor para autenticar al usuario.
   * Si el inicio de sesión es exitoso, guarda el token en el almacenamiento local.
   *
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Observable con la respuesta del servidor que incluye el token de autenticación.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.env.apiBaseUrl}/auth/signin`, { email, password }).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  /**
   * Guarda el token de autenticación en el almacenamiento local.
   * @param token Token JWT que se almacenará.
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtiene el token de autenticación almacenado en el almacenamiento local.
   * @returns El token JWT si está disponible, de lo contrario, null.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Verifica si el usuario está autenticado comprobando la validez del token.
   * @returns true si el token es válido y no ha expirado, de lo contrario, false.
   */
  isAuth(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = jwtDecode<TokenPayload>(token);
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      console.error('Token inválido', e);
      return false;
    }
  }

  /**
   * Cierra la sesión del usuario eliminando el token del almacenamiento local
   * y redirigiendo al usuario a la página de inicio de sesión.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene la lista de países disponibles desde la API.
   * @returns Observable con la lista de países.
   */
  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.env.apiBaseUrl}/location/countries`);
  }

  /**
   * Obtiene la lista de comunidades disponibles desde la API.
   * @returns Observable con la lista de comunidades.
   */
  getCommunities(): Observable<Community[]> {
    return this.httpClient.get<Community[]>(`${this.env.apiBaseUrl}/location/communities`);
  }

  /**
   * Obtiene la lista de provincias para una comunidad específica desde la API.
   * @param communityId ID de la comunidad para la cual obtener las provincias.
   * @returns Observable con la lista de provincias.
   */
  getProvincesByCommunityId(communityId: string): Observable<Province[]> {
    return this.httpClient.get<Province[]>(`${this.env.apiBaseUrl}/location/provinces/${communityId}`);
  }

  /**
   * Obtiene la lista de usuarios desde la API.
   * @returns Observable con la lista de usuarios.
   */
  getUsers(): Observable<{ users: User[] }> {
    return this.httpClient.get<{ users: User[] }>(`${this.env.apiBaseUrl}/auth/users`);
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      return this.currentUser;
    }

    return null;
  }
}
