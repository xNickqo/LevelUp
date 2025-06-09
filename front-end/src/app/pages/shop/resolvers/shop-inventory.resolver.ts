// src/app/resolvers/shop-inventory.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Cartucho } from '@app/core/models/cartucho.model';
import { CartuchoService } from '@app/core/services/cartucho.service';
import { LoaderService } from '@app/core/services/loader.service';
import { Observable, of } from 'rxjs';
import { catchError, delay, finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ShopInventoryResolver implements Resolve<Cartucho[]> {
  constructor(private cartuchoService: CartuchoService, private loader: LoaderService) {}

  // Resolver que obtiene los productos disponibles en la tienda
  resolve(): Observable<Cartucho[]> {
    this.loader.show();

    return this.cartuchoService.obtenerCartuchos().pipe(
      delay(1000), // Simulamos un delay de 1000ms antes de mostrar el resultado
      catchError(() => {
        console.error('Error al cargar inventario de la tienda');
        return of([]);
      }),
      finalize(() => this.loader.hide())
    );
  }
}
