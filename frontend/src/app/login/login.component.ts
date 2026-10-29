import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loading = false;
  showPassword = false;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  loginUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.loading) return;

    const { email, password } = this.loginForm.getRawValue();
    this.loading = true;
    this.authService.login(email.trim(), password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login failed',
          detail: this.errorText(err),
        });
      },
    });
  }

  private errorText(err: any): string {
    if (err.status === 0) return 'Cannot reach the server. Please try again.';
    if (err.status === 401) return 'Wrong email or password.';
    if (err.status === 429) return 'Too many attempts. Please wait a few minutes.';
    return err.error?.error ?? 'Login failed.';
  }
}