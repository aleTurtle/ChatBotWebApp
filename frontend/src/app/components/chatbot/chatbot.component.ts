import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Per l'input utente
import { ChatService } from '../../services/chat.service'; // Importa il servizio ChatService

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="chat-container">
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
export class ChatbotComponent implements OnInit {
  messages = [{ user: false, text: 'Benvenuto! Come posso aiutarti oggi?' }];
  userInput = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Log per verificare l'iniezione di ChatService
    console.log('ChatService iniettato:', this.chatService);
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ user: true, text: this.userInput });
      this.chatService.sendMessage(this.userInput).subscribe(
        (response) => {
          response.forEach((msg) => {
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
      this.userInput = '';
    }
  }
}
