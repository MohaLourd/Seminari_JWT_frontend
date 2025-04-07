import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:9000/api/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Intentar renovar el token
          return this.authService.refreshAccessToken().pipe(
            switchMap(() => {
              // Reintentar la solicitud después de renovar el token
              return this.http.get(`${this.apiUrl}`);
            }),
            catchError((refreshError) => {
              // Si el refresh token falla, redirigir al login
              this.authService.logout();
              throw refreshError;
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Intentar renovar el token
          return this.authService.refreshAccessToken().pipe(
            switchMap(() => {
              // Reintentar la solicitud después de renovar el token
              return this.http.get(`${this.apiUrl}`);
            }),
            catchError((refreshError) => {
              // Si el refresh token también falla, redirigir al login
              this.authService.logout();
              throw refreshError;
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
