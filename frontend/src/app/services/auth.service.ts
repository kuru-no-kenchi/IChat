import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Observable,
  catchError,
  finalize,
  map,
  of,
  shareReplay,
  tap,
} from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  email: string;
  first_name: string;
  last_name: string;
}
interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
interface AuthResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private accessToken: string | null = null; // memory only, never localStorage
  private refreshInFlight$: Observable<AuthResponse> | null = null;

  readonly user = signal<AuthUser | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);

  get token(): string | null {
    return this.accessToken;
  }

  register(data: RegisterData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.backendHostName}/users/register`,
      data,
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.backendHostName}/users/login`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(tap((res) => this.setSession(res)));
  }

  // One shared request, so parallel 401s don't each rotate the cookie
  refresh(): Observable<AuthResponse> {
    if (!this.refreshInFlight$) {
      this.refreshInFlight$ = this.http
        .post<AuthResponse>(
          `${environment.backendHostName}/users/refresh`,
          {},
          { withCredentials: true },
        )
        .pipe(
          tap((res) => this.setSession(res)),
          finalize(() => (this.refreshInFlight$ = null)),
          shareReplay(1),
        );
    }
    return this.refreshInFlight$;
  }

  // Called once at app start: tries to resume the session from the cookie
  restoreSession(): Observable<void> {
    return this.refresh().pipe(
      map((): void => undefined),
      catchError(() => {
        this.clearSession();
        return of(undefined);
      }),
    );
  }

  updateUser(changes: Partial<AuthUser>): void {
    this.user.update((u) => (u ? { ...u, ...changes } : u));
  }

  logout(): void {
    this.http
      .post(
        `${environment.backendHostName}/users/logout`,
        {},
        { withCredentials: true },
      )
      .pipe(
        catchError(() => of(null)),
        finalize(() => {
          this.clearSession();
          this.router.navigate(['/login']);
        }),
      )
      .subscribe();
  }

  clearSession(): void {
    this.accessToken = null;
    this.user.set(null);
  }

  private setSession(res: AuthResponse): void {
    this.accessToken = res.token;
    this.user.set(res.user);
  }
}
