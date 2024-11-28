import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Per l'input utente
import { ChatService } from '../../services/chat.service';


@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="messages">
        <div *ngFor="let message of messages" [class.user]="message.user">
          <p>{{ message.text }}</p>
        </div>
      </div>
      <div class="input-container">
        <input [(ngModel)]="userInput" placeholder="Scrivi la tua domanda..." />
        <button (click)="sendMessage()">Invia</button>
      </div>
    </div>
  `,
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent {
  messages = [{ user: false, text: 'Benvenuto! Come posso aiutarti oggi?' }];
  userInput = '';

  constructor(private chatService: ChatService) {}
  sendMessage() {
    if (this.userInput.trim()) {
      // Aggiungi il messaggio dell'utente alla chat
      this.messages.push({ user: true, text: this.userInput });

      // Invia il messaggio al backend tramite il ChatService
      this.chatService.sendMessage(this.userInput).subscribe(
        (response) => {
          response.forEach((msg) => {
            // Aggiungi ogni messaggio del bot alla chat
            this.messages.push({ user: false, text: msg.text });
          });
        },
        (error) => {
          console.error('Errore nella comunicazione con il backend:', error);
          this.messages.push({
            user: false,
            text: 'Errore: il bot non è disponibile al momento.',
          });
        }
      );

      // Resetta l'input dell'utente
      this.userInput = '';
    }
  }
}