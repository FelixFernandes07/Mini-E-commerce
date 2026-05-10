import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';
import { ThemeService } from './core/services/theme';
import { LanguageService } from './core/services/language';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(
    private theme: ThemeService,
    private language: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
  }
}