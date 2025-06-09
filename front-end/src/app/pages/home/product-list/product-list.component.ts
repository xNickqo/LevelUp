import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cartucho } from '@app/core/models/cartucho.model';
import { CartuchoService } from '@app/core/services/cartucho.service';
import { GalleriaModule } from 'primeng/galleria';

export interface ResponsiveOptions {
  breakpoint: string;
  numVisible: number;
}

@Component({
  selector: 'app-product-list',
  imports: [GalleriaModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  providers: [CartuchoService]
})
export class ProductListComponent implements OnInit {
  images: Cartucho[] = [];
  activeIndex: number = 0;
  displayCustom: boolean = false;
  responsiveOptions: ResponsiveOptions[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(private cartuchoService: CartuchoService) {}

  ngOnInit(): void {
    // Obtener 6 cartuchos aleatorios
    this.cartuchoService.obtenerCartuchosAleatorios(6).subscribe((response) => {
      this.images = response;
    });
  }

  imageClick(index: number): void {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}
