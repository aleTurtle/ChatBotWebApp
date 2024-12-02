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
          <li><a routerLink="/contact" class="navbar-link">Contact</a></li>
        </ul>
      </nav>

      <!-- Contenuto della tua app -->
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
