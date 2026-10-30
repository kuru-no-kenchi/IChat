import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../services/theme.service';
import { LANGUAGES, Lang, LanguageService } from '../services/language.service';
import { LogoMarkComponent } from '../logo-mark/logo-mark.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, TranslateModule, LogoMarkComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  readonly theme = inject(ThemeService);
  readonly lang = inject(LanguageService);

  readonly repoUrl = 'https://github.com/kuru-no-kenchi';
  readonly year = new Date().getFullYear();

  readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
  ];

  readonly features = [
    { icon: 'bi-clock-history', title: 'LANDING_F1_TITLE', text: 'LANDING_F1_TEXT' },
    { icon: 'bi-mic', title: 'LANDING_F2_TITLE', text: 'LANDING_F2_TEXT' },
    { icon: 'bi-translate', title: 'LANDING_F3_TITLE', text: 'LANDING_F3_TEXT' },
  ];

  changeLanguage(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if ((LANGUAGES as readonly string[]).includes(value)) this.lang.setLanguage(value as Lang);
  }
}