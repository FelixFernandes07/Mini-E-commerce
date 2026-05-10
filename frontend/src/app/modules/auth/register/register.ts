import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  success = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success = 'Conta criada com sucesso!';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erro ao criar conta';
        this.loading = false;
      }
    });
  }
}