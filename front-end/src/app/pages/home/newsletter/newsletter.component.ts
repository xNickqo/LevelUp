import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss'
})
export class NewsletterComponent {
  email: string = '';
  placeholderText: string = 'Introduce tu correo electrónico';
  defaultPlaceholder: string = 'Introduce tu correo electrónico';
  isError: boolean = false;
  isSuccess: boolean = false;
  isLoading: boolean = false;
  timeoutRef: ReturnType<typeof setTimeout> | null = null;

  constructor(private http: HttpClient) {}

  subscribe(): void {
    this.clearFeedback();

    if (!this.email || !this.email.includes('@')) {
      this.setFeedback('Correo inválido', true);
      return;
    }

    this.isLoading = true;

    this.http.post<{ success: boolean; message: string }>('http://localhost:3000/email/send', { email: this.email }).subscribe({
      next: () => {
        this.setFeedback('¡Gracias por suscribirte!', false);
        this.email = '';
        this.isLoading = false;
      },
      error: () => {
        this.setFeedback('Error al enviar el correo', true);
        this.isLoading = false;
      }
    });
  }

  private setFeedback(message: string, isError: boolean): void {
    this.placeholderText = message;
    this.isError = isError;
    this.isSuccess = !isError;

    this.timeoutRef = setTimeout(() => {
      this.placeholderText = this.defaultPlaceholder;
      this.isError = false;
      this.isSuccess = false;
    }, 5000);
  }

  private clearFeedback(): void {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
    }
    this.placeholderText = this.defaultPlaceholder;
    this.isError = false;
    this.isSuccess = false;
  }
}
