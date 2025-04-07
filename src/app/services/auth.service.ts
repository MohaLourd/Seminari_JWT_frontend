import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      switchMap((response: any) => {
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('refresh_token', response.refreshToken); // Guardar el refresh token
        return of(response);
      })
    );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`;
  }

  handleGoogleCallback(token: string): Observable<any> {
    localStorage.setItem('access_token', token);
    return of({ success: true, token: token });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      switchMap((response: any) => {
        localStorage.setItem('access_token', response.token);
        return of(response.token);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }
}
