import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Servizio per la gestione dell'autenticazione
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,CommonModule], 
  template: `
    <div class="app-container">
      <!-- Navbar con il titolo S Y N C H R O -->
      <nav class="navbar">
        <h1 class="title">S Y N C H R O</h1>
        <ul class="navbar-menu">
          <li><a routerLink="/home" class="navbar-link">Home</a></li>
          <li><a routerLink="/about" class="navbar-link">About</a></li>
          <li><a routerLink="/chatbot" class="navbar-link">Chatbot</a></li>
        </ul>

        <!-- Aggiunta dei pulsanti di login, sign up e logout -->
        <div class="navbar-buttons">
          <!-- Se l'utente è autenticato, mostra il pulsante di logout -->
          <button *ngIf="isAuthenticated" class="btn-logout" (click)="logout()">Logout</button>
          
          <!-- Se l'utente NON è autenticato, mostra i pulsanti di login e sign up -->
          <button *ngIf="!isAuthenticated" class="btn-login" routerLink="/login">Login</button>
          <button *ngIf="!isAuthenticated" class="btn-signup" routerLink="/sign-up">Sign Up</button>
        </div>
      </nav>

      <!-- Contenuto della tua app -->
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuthenticated = false; // Variabile che tiene traccia dello stato di autenticazione

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkAuthentication(); // Verifica lo stato di autenticazione all'avvio
  }

  // Controlla se l'utente è autenticato
  checkAuthentication() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  // Funzione di logout
  logout() {
    this.authService.logout(); // Effettua il logout usando il servizio
    this.isAuthenticated = false; // Aggiorna lo stato di autenticazione
    this.router.navigate(['/home']); // Dopo il logout, redirige alla home o altra pagina
  }
}
