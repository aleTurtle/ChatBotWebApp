import { Component } from '@angular/core';
import {  RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink], 
  template: `
    <div class="app-container">
      <!-- Navbar con il titolo S Y N C H R O -->
      <nav class="navbar">
        <h1 class="title">S Y N C H R O</h1>
        <ul class="navbar-menu">
          <!-- Usa routerLink per collegare alla home -->
          <li><a routerLink="/home" class="navbar-link">Home</a></li>
          <li><a routerLink="/about" class="navbar-link">About</a></li>
          <li><a routerLink="/chatbot" class="navbar-link">Chatbot</a></li>
        </ul>
        <!-- Aggiunta dei pulsanti di login e registrazione -->
       <div class="navbar-buttons">
      <button class="btn-login" routerLink="/login">Login</button>
       <button class="btn-signup" routerLink="/sign-up">Sign Up</button>
      </div>
      </nav>

      <!-- Contenuto della tua app -->
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
