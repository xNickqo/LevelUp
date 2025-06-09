import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from './common/components/footer/footer.component';
import { LocaleService } from './core/locale/locale.service';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private locale: LocaleService = inject(LocaleService);

  constructor(public loaderService: LoaderService) {
    this.locale.setupAppLanguage();
  }
}
