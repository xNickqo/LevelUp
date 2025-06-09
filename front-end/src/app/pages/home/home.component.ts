import { Component } from '@angular/core';
import { HeaderComponent } from '@app/common/components/header/header.component';
import { PreFooterComponent } from '@app/common/components/pre-footer/pre-footer.component';
import { AboutComponent } from './about/about.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { HeroComponent } from './hero/hero.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    FeaturedProductsComponent,
    NewsletterComponent,
    ProductListComponent,
    AboutComponent,
    PreFooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
