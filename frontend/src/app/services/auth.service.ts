import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/AuthResponse'; 
import { environment } from '../../environments/environment.development';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly USER_KEY = 'authenticatedUser'; // Chiave per localStorage
  private readonly TOKEN_KEY = 'authToken'; // Chiave per il token in localStorage

  constructor(private http: HttpClient) {}

  // Registrazione (Sign Up)
  signUp(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/api/sign-up`, { username, password });
  }

  // Login
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/api/login`, { username, password });
  }

  // Salva il token in localStorage
  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Errore nel salvataggio del token:', error);
    }
  }

  // Salva l'utente autenticato in localStorage
  setAuthenticatedUser(user: User): void {
    try {
      const userJson = JSON.stringify(user);
      localStorage.setItem(this.USER_KEY, userJson);
    } catch (error) {
      console.error('Errore nel salvataggio dell\'utente autenticato:', error);
    }
  }

  // Recupera l'utente autenticato
  getAuthenticatedUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) {
      return null;
    }
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Errore nel parsing di userData:', error);
      return null;
    }
  }

  // Ottieni il token da localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? true : false; // Se c'è un token, l'utente è autenticato
  }

  // Logout (rimuove il token e l'utente)
  logout(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }
}
