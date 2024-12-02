import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { ChatbotComponent } from './components/chatbot/chatbot.component'; // Percorso corretto al tuo ChatbotComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Aggiungi il ChatbotComponent ai moduli importati
  template: `
    <div class="app-container">
      <!-- Navbar con il titolo S Y N C H R O all'interno -->
      <nav class="navbar">
        <h1 class="title">S Y N C H R O</h1>
        <ul class="navbar-menu">
          <li><a href="#" class="navbar-link">Home</a></li>
          <li><a href="#" class="navbar-link">About</a></li>
          <li><a href="#" class="navbar-link">Contact</a></li>
        </ul>
      </nav>

      <!-- Contenuto della tua app -->
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
