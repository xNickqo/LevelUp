import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  imports: [CommonModule, TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  isMobile: boolean = false;
  contentVisible: boolean = false;

  /**
   * Hook de ciclo de vida que se ejecuta al inicializar el componente.
   * Determina si se debe mostrar el contenido basado en el tamaño de pantalla.
   */
  ngOnInit(): void {
    this.checkScreenSize();
  }

  /**
   * Escucha los cambios de tamaño de ventana para verificar si el dispositivo es móvil.
   * Actualiza el estado de visibilidad del contenido en consecuencia.
   */
  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 1024;
    if (!this.isMobile) {
      this.contentVisible = true;
    } else {
      this.contentVisible = false;
    }
  }

  /**
   * Alterna la visibilidad del contenido al hacer clic, útil para pantallas móviles.
   * Previene el comportamiento por defecto del evento.
   *
   * @param event Evento de clic del usuario
   */
  toggleContent(event: Event): void {
    event.preventDefault();
    this.contentVisible = !this.contentVisible;
  }
}
