import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
  this.loading = true;
  this.error = '';

  this.auth.login({ email: this.email, password: this.password }).subscribe({
    next: (res) => {
      console.log('Resposta:', res);
      if (res && res.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        if (res.data.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/shop']);
        }
      } else {
        this.error = res.message || 'Erro ao fazer login';
        this.loading = false;
      }
    },
    error: (err) => {
      console.log('Erro:', err);
      this.error = err.error?.message || 'Erro ao fazer login';
      this.loading = false;
    }
  });
}
}