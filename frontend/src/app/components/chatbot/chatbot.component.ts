import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Per l'input utente

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

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ user: true, text: this.userInput });
      this.messages.push({ user: false, text: 'Elaborazione della tua domanda...' }); // Placeholder
      this.userInput = '';
    }
  }
}
