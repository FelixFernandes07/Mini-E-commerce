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
  step = 1;
  email = '';
  code = '';
  generatedCode = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService) {}

  requestCode() {
    this.loading = true;
    this.error = '';

    this.auth.resetPassword(this.email).subscribe({
      next: (res) => {
        this.generatedCode = res.data?.code;
        this.success = `Código gerado: ${this.generatedCode}`;
        this.step = 2;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erro ao gerar código!';
        this.loading = false;
      }
    });
  }

  verifyCode() {
    this.loading = true;
    this.error = '';

    this.auth.verifyCode(this.email, this.code).subscribe({
      next: () => {
        this.step = 3;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Código inválido!';
        this.loading = false;
      }
    });
  }

  setNewPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'As senhas não coincidem!';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'A senha deve ter pelo menos 6 caracteres!';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.setNewPassword(this.email, this.code, this.newPassword).subscribe({
      next: () => {
        this.success = 'Senha alterada com sucesso!';
        this.step = 4;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erro ao alterar senha!';
        this.loading = false;
      }
    });
  }
}