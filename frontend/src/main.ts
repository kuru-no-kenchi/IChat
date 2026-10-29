import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { HomeComponent } from './app/home/home.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { SettingsComponent } from './app/settings/settings.component';
import { authGuard } from './app/guard/auth.guard';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotfoundComponent } from './app/notfound/notfound.component';
import { ProfileComponent } from './app/profile/profile.component';
import { provideTranslateModule } from './app/services/translation.service';
import { inject, provideAppInitializer } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './app/services/auth.service';
import { authInterceptor } from './app/interceptors/auth.interceptor';
bootstrapApplication(AppComponent, {
  providers: [
    provideAppInitializer(() =>
      firstValueFrom(inject(AuthService).restoreSession()),
    ),
    provideTranslateModule(),
    MessageService,
    ConfirmationService,
    provideRouter([
      { path: 'home', component: HomeComponent, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', component: LoginComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
      },
      { path: '**', component: NotfoundComponent, canActivate: [authGuard] },
    ]),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: false,
        },
      },
    }),
  ],
}).catch((err) => console.error(err));
