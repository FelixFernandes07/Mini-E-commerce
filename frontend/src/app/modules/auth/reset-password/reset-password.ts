import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPasswordComponent {
  email = '';
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.auth.resetPassword(this.email).subscribe({
      next: () => {
        this.success = 'Email de recuperação enviado!';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erro ao enviar email';
        this.loading = false;
      }
    });
  }
}