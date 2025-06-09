import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cartucho } from '@app/core/models/cartucho.model';
import { Observable } from 'rxjs';
import { tematicas } from '../models/tematicas.model';
export { Cartucho };

export interface ApiPaginatedResponse<T> {
  entities: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filter: {
    search: string;
  };
  sort: {
    field: string;
    order: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartuchoService {
  constructor(private http: HttpClient) {}

  /**
   * Realiza una petición GET para obtener cartuchos paginados.
   * @param page Número de página (comienza en 1 según tu API)
   * @param limit Límite de elementos por página
   * @param search Término de búsqueda opcional
   * @param sortField Campo para ordenar
   * @param sortOrder Orden (asc o desc)
   * @returns Observable con respuesta paginada de cartuchos
   */
  obtenerCartuchosPaginados(
    table: string = 'data',
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sortField: string = 'createdAt',
    sortOrder: string = 'desc'
  ): Observable<ApiPaginatedResponse<Cartucho>> {
    let params = new HttpParams()
      .set('table', table)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    if (search && search.trim().length > 0) {
      params = params.set('search', search);
    }

    return this.http.get<ApiPaginatedResponse<Cartucho>>('http://localhost:3000/api/paginated-entities', { params });
  }

  /**
   * Envía una petición POST para crear un nuevo cartucho en el backend.
   * @param cartucho Objeto con los datos del cartucho a crear
   * @returns Observable del cartucho creado
   */
  crearCartucho(cartucho: Cartucho): Observable<Cartucho> {
    return this.http.post<Cartucho>('http://localhost:3000/api/entities', cartucho);
  }

  /**
   * Realiza una petición GET para obtener todos los cartuchos del backend.
   * @returns Observable con un array de cartuchos
   */
  obtenerCartuchos(): Observable<Cartucho[]> {
    return this.http.get<Cartucho[]>('http://localhost:3000/api/entities');
  }

  /**
   * Realiza una petición GET para obtener un cartucho específico por su ID.
   * @param id Identificador del cartucho
   * @returns Observable con el cartucho correspondiente
   */
  obtenerCartuchoPorId(id: string): Observable<Cartucho> {
    return this.http.get<Cartucho>('http://localhost:3000/api/entities/' + id);
  }

  /**
   * Obtiene una cantidad aleatoria de cartuchos del backend.
   * @param cantidad Número de cartuchos aleatorios a devolver
   * @returns Observable con los cartuchos aleatorios
   */
  obtenerCartuchosAleatorios(cantidad: number): Observable<Cartucho[]> {
    return new Observable((observer) => {
      this.obtenerCartuchos().subscribe({
        next: (todos) => {
          const barajados = this.barajarArray(todos);
          observer.next(barajados.slice(0, cantidad));
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /**
   * Algoritmo de barajado (Fisher-Yates).
   */
  private barajarArray<T>(array: T[]): T[] {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  /**
   * Envía una petición PUT para actualizar un cartucho existente.
   * @param id ID del cartucho a actualizar
   * @param cartucho Objeto con los nuevos datos
   * @returns Observable del cartucho actualizado
   */
  actualizarCartucho(id: string, cartucho: Cartucho): Observable<Cartucho> {
    return this.http.put<Cartucho>('http://localhost:3000/api/entities/' + id, cartucho);
  }

  /**
   * Realiza una petición DELETE para eliminar un cartucho por su ID.
   * @param id ID del cartucho a eliminar
   * @returns Observable vacío (void) al completarse la eliminación
   */
  eliminarCartucho(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/entities/${id}`);
  }

  // Ruta para obtener temáticas
  getTematicas(): Observable<tematicas[]> {
    return this.http.get<tematicas[]>('http://localhost:3000/api/tematicas');
  }
}
