import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

// These endpoints must not get a token or trigger a refresh
const AUTH_CALLS = /\/users\/(login|register|refresh|logout)$/;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.backendHostName)) return next(req); // never send the token to other sites

  const auth = inject(AuthService);
  const router = inject(Router);

  if (AUTH_CALLS.test(req.url)) {
    return next(req.clone({ withCredentials: true }));
  }

  const withToken = (r: typeof req) =>
    auth.token
      ? r.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } })
      : r;

  return next(withToken(req)).pipe(
    catchError((err) => {
      if (err.status !== 401) return throwError(() => err);

      // Access token expired: refresh once, then retry the original request
      return auth.refresh().pipe(
        catchError((refreshErr) => {
          auth.clearSession();
          router.navigate(['/login']);
          return throwError(() => refreshErr);
        }),
        switchMap(() => next(withToken(req))),
      );
    }),
  );
};
