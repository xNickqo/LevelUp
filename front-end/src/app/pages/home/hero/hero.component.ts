import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartuchoService } from '@app/core/services/cartucho.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {
  images: {
    url: string;
    descripcion: string;
  }[] = [];

  constructor(private cartuchoService: CartuchoService) {}

  ngOnInit(): void {
    this.cartuchoService.obtenerCartuchos().subscribe((response) => {
      //console.log('Response:', response);

      for (let i = 0; i < 3; i++) {
        if (response[i]) {
          this.images.push({
            url: response[i].imagenUrl,
            descripcion: response[i].descripcion
          });
        }
      }
    });
  }
}
