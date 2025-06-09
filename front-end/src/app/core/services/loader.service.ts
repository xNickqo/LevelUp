import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  // Contador para rastrear cuántas operaciones de carga están activas
  // Esto es necesario porque puede haber varias peticiones simultáneas
  // y queremos que el loader solo se oculte cuando todas hayan finalizado.
  private loadingCount = 0;

  private _loading = signal(false);

  private showTimeoutId: number | null = null;

  // Mostrar el loader: incrementa el contador y activa la señal
  show() {
    this.loadingCount++;

    if (this.loadingCount === 1) {
      this.showTimeoutId = window.setTimeout(() => {
        this.showTimeoutId = null;
        if (this.loadingCount > 0 && !this._loading()) {
          //console.log('Loader mostrado');
          this._loading.set(true);
        }
      }, 500); // Solo mostrar el loader si han pasado 500ms desde que se inició la operación
    }
  }

  // Ocultar el loader: decrementa el contador y si no quedan cargas activas, desactiva la señal
  hide() {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }

    if (this.loadingCount === 0) {
      // Si el timeout para mostrar loader está activo y no se ha mostrado aún, lo cancelamos
      if (this.showTimeoutId !== null) {
        clearTimeout(this.showTimeoutId);
        this.showTimeoutId = null;
      }

      // Solo ocultamos el loader si está visible
      if (this._loading()) {
        //console.log('Loader oculto');
        this._loading.set(false);
      }
    }
  }

  // Método para obtener el estado actual del loader
  isLoading = () => this._loading();
}
