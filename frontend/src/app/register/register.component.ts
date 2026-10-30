import { Component, inject } from '@angular/core';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { LogoMarkComponent } from '../logo-mark/logo-mark.component';

const passwordsMatch = (group: AbstractControl): ValidationErrors | null =>
  group.get('password')?.value === group.get('confirmPassword')?.value ? null : { passwordMismatch: true };

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, LogoMarkComponent],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loading = false;
  showPassword = false;

  registerForm = this.fb.nonNullable.group(
    {
      first_name: ['', [Validators.required, Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  get f() {
    return this.registerForm.controls;
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (this.loading) return;

    const v = this.registerForm.getRawValue();
    this.loading = true;
    this.authService
      .register({
        first_name: v.first_name.trim(),
        last_name: v.last_name.trim(),
        email: v.email.trim(),
        password: v.password,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account created. You can log in now.',
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Registration failed',
            detail: this.errorText(err),
          });
        },
      });
  }

  private errorText(err: any): string {
    if (err.status === 0) return 'Cannot reach the server. Please try again.';
    if (err.status === 409) return 'This email is already in use.';
    if (err.status === 429) return 'Too many attempts. Please wait a few minutes.';
    return err.error?.error ?? 'Registration failed.';
  }
}