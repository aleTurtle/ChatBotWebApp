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
    <div *ngFor="let message of messages" [ngClass]="{ 'message': true, 'justify-end': message.user, 'justify-start': !message.user }">
      <div [ngClass]="{ 'user': message.user, 'bot': !message.user }">

        <!-- Aggiungi l'icona del chatbot accanto al messaggio -->
        <div *ngIf="!message.user" class="chatbot-icon">
          <img src="assets/images/autobot.png" alt="Chatbot Icon" />
        </div>
        <div class="message-text">
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>

  <!-- Spinner di caricamento -->
  <div *ngIf="loading" class="loading-spinner">
    <div class="spinner"></div>
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
  loading = false; // Stato per tracciare se lo spinner è visibile

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Log per verificare l'iniezione di ChatService
    console.log('ChatService iniettato:', this.chatService);
  }

  sendMessage() {
    if (this.userInput.trim()) {
      console.log('Messaggio inviato:', this.userInput);
      this.messages.push({ user: true, text: this.userInput });
      
      // Mostra lo spinner mentre il bot elabora la risposta
      this.loading = true;

      this.chatService.sendMessage(this.userInput).subscribe(
        (response) => {
          console.log('Risposta dal backend:', response);
          
          // Accedi al primo oggetto nell'array 'responses' (poiché c'è solo un oggetto)
          if (response.responses && response.responses.length > 0) {
            this.messages.push({ user: false, text: response.responses[0].text });
          }
          
          // Nascondi lo spinner dopo aver ricevuto la risposta
          this.loading = false;
        },
        (error) => {
          console.error('Errore nella comunicazione con il backend:', error);
          this.messages.push({
            user: false,
            text: 'Errore: il bot non è disponibile al momento.',
          });

          // Nascondi lo spinner in caso di errore
          this.loading = false;
        }
      );
      this.userInput = '';
    }
  }
}
