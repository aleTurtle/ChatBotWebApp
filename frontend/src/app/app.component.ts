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
    <li><a routerLink="/home" class="navbar-link" (click)="goToHome()">Home</a></li>

     <li><a routerLink="/about" class="navbar-link">About</a></li>

     <!-- Mostra "Supporto" solo se l'utente è autenticato -->
    <li *ngIf="isAuthenticated"><a routerLink="/support" class="navbar-link">Supporto</a></li>
    
    <!-- Mostra "Chatbot" solo se l'utente non è autenticato -->
    <li *ngIf="!isAuthenticated"><a routerLink="/chatbot" class="navbar-link">Chatbot</a></li>
    
   
  </ul>

  <div class="navbar-buttons">
    <button *ngIf="isAuthenticated" class="btn-logout" (click)="logout()">Logout</button>
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

  // Funzione per gestire il click sulla voce "Home"
  goToHome() {
    if (this.isAuthenticated) {
      this.router.navigate(['/user']); // Naviga alla pagina dell'utente autenticato
    } else {
      this.router.navigate(['/home']); // Naviga alla pagina "home" se non autenticato
    }
  }

  // Funzione di logout
  logout() {
    this.authService.logout(); // Effettua il logout usando il servizio
    this.isAuthenticated = false; // Aggiorna lo stato di autenticazione
    this.router.navigate(['/home']); // Dopo il logout, redirige alla home o altra pagina
  }
}

