import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cartucho } from '@app/core/models/cartucho.model';
import { CartuchoService } from '@app/core/services/cartucho.service';

@Component({
  selector: 'app-product-data',
  imports: [CommonModule],
  templateUrl: './product-data.component.html',
  styleUrl: './product-data.component.scss'
})
export class ProductDataComponent implements OnInit {
  productId: string | null = null;
  cartucho: Cartucho | null = null;
  error = '';

  constructor(private route: ActivatedRoute, private router: Router, private cartuchoService: CartuchoService) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (!this.productId) {
      this.error = 'ID de producto inválido.';
      return;
    }

    this.cartuchoService.obtenerCartuchoPorId(this.productId).subscribe({
      next: (data) => {
        this.cartucho = data;
        if (!data) {
          this.error = 'Producto no encontrado.';
        }
      },
      error: () => {
        this.error = 'Error al cargar el producto.';
      }
    });
  }

  close() {
    this.router.navigate(['../shop']);
  }
}
