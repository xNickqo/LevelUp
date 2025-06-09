import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cartucho, CartuchoService } from '@app/core/services/cartucho.service';

import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';

export interface ResponsiveOptions {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

@Component({
  selector: 'app-featured-products',
  imports: [CommonModule, CarouselModule, ButtonModule, TagModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
  providers: [CartuchoService]
})
export class FeaturedProductsComponent implements OnInit {
  cartuchos: Cartucho[] = [];
  numScroll: number = 1;

  responsiveOptions: ResponsiveOptions[] = [];

  constructor(private cartuchoService: CartuchoService) {}

  ngOnInit() {
    this.cartuchoService.obtenerCartuchosAleatorios(6).subscribe((res) => {
      this.cartuchos = res;

      // Adapta el scroll según el número de cartuchos
      this.numScroll = Math.min(res.length, 2); // no más de 2 scrolls
    });

    this.responsiveOptions = [
      {
        breakpoint: '1440px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '1024px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }
}
