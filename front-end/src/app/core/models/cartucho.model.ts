/**
 * Representa un cartucho arcade con sus propiedades principales.
 */
export interface Cartucho {
  id?: string;
  nombre: string;
  descripcion: string;
  tematica: string;
  precio: number;
  imagenUrl: string;
  createdAt?: string;
  updatedAt?: string;
}
