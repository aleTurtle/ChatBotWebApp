import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Per l'input utente
import { ChatService } from '../../services/chat.service'; // Importa il servizio ChatService

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

      <!-- Chat Window -->
      <div class="chat-window" [ngClass]="chatWindowClass">
        <!-- Area dei messaggi -->
        <div class="messages">
          <div *ngFor="let message of messages; let i = index" [ngClass]="{ 'message': true, 'justify-end': message.user, 'justify-start': !message.user }">
            <div [ngClass]="{ 'user': message.user, 'bot': !message.user }">
              <!-- Icona del chatbot accanto al messaggio del bot -->
              <div *ngIf="!message.user" class="chatbot-icon">
                <img src="assets/images/autobot.png" alt="Chatbot Icon" />
              </div>
              <!-- Mostra lo spinner solo per l'ultimo messaggio del bot in caricamento -->
              <div class="message-text">
                <ng-container *ngIf="loadingIndex !== i; else loadingSpinner">
                  {{ message.text }}
                </ng-container>
                <!-- Template dello spinner -->
                <ng-template #loadingSpinner>
                  <div class="spinner"></div>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
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
  loading = false;
  loadingIndex: number | null = null;

  // Stato della sidebar
  sidebarOpen = true;

  // Array di conversazioni fittizie
  placeholderConversations = [
    { id: 1, name: 'Conversazione 1' },
    { id: 2, name: 'Conversazione 2' },
    { id: 3, name: 'Conversazione 3' },
  ];

  // Classe dinamica per la chat window
  chatWindowClass = { reduced: true, centered: false };

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    console.log('ChatService iniettato:', this.chatService);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;

    // Aggiorna le classi dinamiche in base allo stato della sidebar
    if (this.sidebarOpen) {
      this.chatWindowClass = { reduced: true, centered: false };
    } else {
      this.chatWindowClass = { reduced: false, centered: true };
    }
  }

  sendMessage() {
    if (this.userInput.trim()) {
      console.log('Messaggio inviato:', this.userInput);
      this.messages.push({ user: true, text: this.userInput });
      const botIndex = this.messages.length;
      this.messages.push({ user: false, text: '' });
      this.loadingIndex = botIndex;
      this.loading = true;

      this.chatService.sendMessage(this.userInput).subscribe(
        (response) => {
          console.log('Risposta dal backend:', response);
          if (response.responses && response.responses.length > 0) {
            this.messages[botIndex].text = response.responses[0].text;
          }
          this.loading = false;
          this.loadingIndex = null;
        },
        (error) => {
          console.error('Errore nella comunicazione con il backend:', error);
          this.messages[botIndex].text = 'Errore: il bot non è disponibile al momento.';
          this.loading = false;
          this.loadingIndex = null;
        }
      );
      this.userInput = '';
    }
  }
}
