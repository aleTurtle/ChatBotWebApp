import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/AuthResponse'; 
import { environment } from '../../environments/environment.development';
import { User} from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly USER_KEY = 'authenticatedUser'; // Chiave per localStorage

  constructor(private http: HttpClient) {}

  // Registrazione (Sign Up)
  signUp(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(environment.baseUrl+'/api/sign-up', { username, password });
  }

  // Login
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(environment.baseUrl+'/api/login', { username, password });
  }

  // Salva il token in localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  setAuthenticatedUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getAuthenticatedUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
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
    localStorage.removeItem(this.USER_KEY);
  }
}
