import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from './components/chatbot/chatbot.component'; // Percorso corretto al tuo ChatbotComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatbotComponent], // Aggiungi il ChatbotComponent ai moduli importati
  template: `
    <div class="app-container">
      <h1>University Chatbot</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
