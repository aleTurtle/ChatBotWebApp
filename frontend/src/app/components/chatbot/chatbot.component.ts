import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Per l'input utente
import { ChatService } from '../../services/chat.service'; // Importa il servizio ChatService

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ` 
    <div class="chat-window">

      <!-- Area dei messaggi -->
      <div class="messages">
        <div *ngFor="let message of messages; let i = index" [ngClass]="{ 'message': true, 'justify-end': message.user, 'justify-start': !message.user }">
          <div [ngClass]="{ 'user': message.user, 'bot': !message.user }">

            <!-- Icona del chatbot accanto al messaggio del bot -->
            <div *ngIf="!message.user" class="chatbot-icon">
              <img src="assets/images/autobot.png" alt="Chatbot Icon" />
            </div>

            <!-- Mostra il testo o lo spinner -->
            <div class="message-text">
              <ng-container *ngIf="!(loading && i === messages.length - 1); else spinnerTemplate">
                {{ message.text }}
              </ng-container>
            </div>

          </div>
        </div>
      </div>

      <!-- Template dello spinner -->
      <ng-template #spinnerTemplate>
        <div class="spinner"></div>
      </ng-template>

      <!-- Input Box -->
      <div class="input-box">
        <textarea 
          [(ngModel)]="userInput" 
          placeholder="Scrivi un messaggio..." 
          (keydown.enter)="sendMessage()" 
          rows="1">
        </textarea>
        <button (click)="sendMessage()">
          <span class="send-icon">➤</span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit {
  messages = [{ user: false, text: 'Benvenuto! Come posso aiutarti oggi?' }];
  userInput = '';
  loading = false; // Stato per tracciare il caricamento

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    console.log('ChatService iniettato:', this.chatService);
  }

  sendMessage() {
    if (this.userInput.trim()) {
      console.log('Messaggio inviato:', this.userInput);

      // Aggiungi il messaggio dell'utente
      this.messages.push({ user: true, text: this.userInput });

      // Aggiungi un messaggio vuoto per il bot (in caricamento)
      this.messages.push({ user: false, text: '' });
      this.loading = true;

      this.chatService.sendMessage(this.userInput).subscribe(
        (response) => {
          console.log('Risposta dal backend:', response);

          if (response.responses && response.responses.length > 0) {
            // Aggiorna l'ultimo messaggio del bot
            this.messages[this.messages.length - 1].text = response.responses[0].text;
          }

          this.loading = false; // Ferma il caricamento
        },
        (error) => {
          console.error('Errore nella comunicazione con il backend:', error);

          // Mostra un messaggio di errore
          this.messages[this.messages.length - 1].text = 'Errore: il bot non è disponibile al momento.';

          this.loading = false; // Ferma il caricamento
        }
      );

      this.userInput = ''; // Resetta il campo di input
    }
  }
}
