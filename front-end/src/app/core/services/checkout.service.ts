import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { Cartucho } from '../models/cartucho.model';
import { environment } from '@env';


interface CheckoutResponse {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private serverURL = `${environment.apiBaseUrl}/stripe/checkout`;
  private readonly _http = inject(HttpClient);
  private key = environment.stripePublicKey;

  constructor() {}

  /**
   * Inicia el proceso de pago con Stripe.
   * @param cartuchos Lista de productos añadidos al carrito
   * @returns Promise que se resuelve cuando el proceso de pago se haya completado
   */
  async onProceedToPay(cartuchos: Cartucho[]): Promise<void> {
    try {
      const response: CheckoutResponse = await firstValueFrom(
        this._http.post<CheckoutResponse>(this.serverURL, {
          items: cartuchos.map((cart) => ({
            nombre: cart.nombre,
            descripcion: cart.descripcion,
            precio: cart.precio
          }))
        })
      );
      //console.log('Session ID recibido:', response.id);
      const stripe = await loadStripe(this.key);
      stripe?.redirectToCheckout({ sessionId: response.id });
    } catch (error) {
      console.error('Error al iniciar pago con Stripe:', error);
    }
  }
}
