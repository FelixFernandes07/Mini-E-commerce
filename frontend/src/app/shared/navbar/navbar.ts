import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { ThemeService } from '../../core/services/theme';
import { LanguageService } from '../../core/services/language';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    public lang: LanguageService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }

  toggleLang() {
    this.lang.toggleLanguage();
  }

  isAdmin() {
    return this.auth.isAdmin();
  }
}