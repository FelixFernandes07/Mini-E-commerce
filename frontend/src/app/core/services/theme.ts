import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = false;

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.enableDark();
    }
  }

  toggleTheme() {
    if (this.isDark) {
      this.enableLight();
    } else {
      this.enableDark();
    }
  }

  enableDark() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    this.isDark = true;
  }

  enableLight() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    this.isDark = false;
  }

  isDarkMode(): boolean {
    return this.isDark;
  }
}