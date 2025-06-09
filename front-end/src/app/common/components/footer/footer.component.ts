import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DEFAULT_I18N_LANG } from '@app/core/constants/global.constants';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  translateService = inject(TranslateService);

  currentLang = DEFAULT_I18N_LANG;
  languageItems: string[] | undefined;

  ngOnInit(): void {
    this.currentLang = 'es';

    // Establecemos el idioma por defecto
    this.translateService.setDefaultLang(this.currentLang);

    // Seleccionamos el idioma actual
    this.translateService.use(this.currentLang);

    // Obtenemos los idiomas disponibles para el desplegable
    this.languageItems = this.translateService.getLangs();
  }

  // Método para seleccionar el idioma en el desplegable
  selectLanguage(lang: string): void {
    this.translateService.use(lang);
  }
}
