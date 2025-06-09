import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterModule } from '@angular/router';
import { TokenPayload } from '@app/core/models/tokenPayload.model';
import { User } from '@app/core/models/user.model';
import { AuthService } from '@app/core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatSlideToggleModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  usuario!: User;
  @ViewChild('dropdownToggle', { read: ElementRef }) dropdownToggle!: ElementRef;
  isDropdownOpen = false;
  isAdmin: boolean = false;
  isDarkMode = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Obtener los usuarios de la API
    this.authService.getUsers().subscribe({
      next: (response) => {
        console.log('Usuarios obtenidos:', response.users);
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });

    this.loadDarkModeSetting();
    this.loadUserInfo();
  }

  /**
   * Carga la información del usuario actual desde el localStorage.
   * Verifica si el usuario es admin.
   */
  private loadUserInfo(): void {
    const token = this.authService.getToken();
    if (token) {
      // Obtenemos el token JWT y verificamos si es un admin para permitir el acceso a la ruta crud
      const decoded = jwtDecode<TokenPayload>(token);
      this.isAdmin = decoded.role === 'admin';

      // Obtener el usuario actual
      const usuario = this.authService.getCurrentUser();
      if (usuario) {
        this.usuario = usuario;
      }
    }
  }

  /**
   * Carga el modo oscuro desde localStorage y lo aplica al <body>.
   */
  private loadDarkModeSetting(): void {
    const storedSetting = localStorage.getItem('darkmode');
    this.isDarkMode = storedSetting === 'true';
    document.body.classList.toggle('darkmode', this.isDarkMode);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isDropdownOpen && this.dropdownToggle && !this.dropdownToggle.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
  }

  /**
   * Cambia el modo oscuro del sitio. Y actualiza el tema en localStorage.
   */
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('darkmode', this.isDarkMode);
    localStorage.setItem('darkmode', this.isDarkMode ? 'true' : 'false');
  }

  goToCrud(): void {
    this.router.navigate(['/crud']);
  }
}
