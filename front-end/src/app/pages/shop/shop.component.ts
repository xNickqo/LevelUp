import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SuccessDialogComponent } from '@app/common/components/success/success.component';
import { Cartucho } from '@app/core/models/cartucho.model';
import { CheckoutService } from '@app/core/services/checkout.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  // Lista de productos disponibles en la tienda
  products: Cartucho[] = [];

  // Lista de productos añadidos al carrito
  cart: Cartucho[] = [];

  // Controla la visibilidad del panel lateral del carrito
  cartVisible = false;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Obtener los productos precargados por el resolver
    this.products = this.route.snapshot.data['products'] || [];

    this.loadCartFromSession();

    this.route.queryParams.subscribe((params) => {
      if (params['payment'] === 'success') {
        this.cart = [];
        sessionStorage.removeItem('cart');
        this.dialog
          .open(SuccessDialogComponent)
          .afterClosed()
          .subscribe(() => {
            window.history.replaceState({}, '', '/shop');
          });
      }
    });
  }

  // Carga el carrito desde la sesión y lo guarda en la variable cart
  loadCartFromSession(): void {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
      try {
        this.cart = JSON.parse(cartData);
      } catch (error) {
        console.error('Error al parsear el carrito desde sessionStorage:', error);
      }
    }
  }

  // Guarda el carrito en sessionStorage
  saveCartToSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  addToCart(product: Cartucho): void {
    if (!this.isInCart(product)) {
      this.cart.push(product);
      this.saveCartToSession();
    }
  }

  // Elimina un producto del carrito si existe
  removeFromCart(product: Cartucho): void {
    const index = this.cart.indexOf(product);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.saveCartToSession();
    }
  }

  // Cambia la visibilidad del carrito (mostrar/ocultar)
  toggleCart(): void {
    this.cartVisible = !this.cartVisible;
  }

  // Verifica si un producto ya está en el carrito
  isInCart(product: Cartucho): boolean {
    return this.cart.some((p) => p.id === product.id);
  }

  // Getter que calcula el total del carrito sumando los precios de los productos
  get total(): number {
    let total = 0;
    for (let i = 0; i < this.cart.length; i++) {
      total += this.cart[i].precio;
    }
    return total;
  }

  // Procede al pago usando el servicio `CheckoutService`
  pay(): void {
    this.checkoutService
      .onProceedToPay(this.cart)
      .then(() => {
        console.log('Pago procesado con éxito');
      })
      .catch((error) => {
        console.error('Error al procesar el pago:', error);
      });
  }

  goToDetail(productId: string | undefined): void {
    this.router.navigate(['product', productId], { relativeTo: this.route });
  }
}
