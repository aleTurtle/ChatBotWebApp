import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/AuthResponse'; 
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  // Registrazione (Sign Up)
  signUp(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(environment.baseUrl+'/api/users/sign-up', { username, password });
  }

  // Login
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(environment.baseUrl+'/api/users/login', { username, password });
  }

  // Salva il token in localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Ottieni il token da localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }

  // Logout (rimuove il token)
  logout(): void {
    localStorage.removeItem('authToken');
  }
}
