import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = 'pt';

  constructor(private translate: TranslateService) {
    const saved = localStorage.getItem('lang');
    if (saved) {
      this.currentLang = saved;
    }
    this.translate.setDefaultLang('pt');
    this.translate.use(this.currentLang);
  }

  toggleLanguage() {
    if (this.currentLang === 'pt') {
      this.setLanguage('en');
    } else {
      this.setLanguage('pt');
    }
  }

  setLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  getCurrentLang(): string {
    return this.currentLang;
  }
}