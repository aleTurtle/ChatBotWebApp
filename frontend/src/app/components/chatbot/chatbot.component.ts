import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Per l'input utente
import { ChatService } from '../../services/chat.service'; // Importa il servizio ChatService

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ` <div class="chat-window p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto mt-8">
  <div class="messages space-y-4">
    <!-- Mostra ogni messaggio -->
    <div
      *ngFor="let message of messages"
      class="message flex"
      [ngClass]="{ 'justify-end': message.user, 'justify-start': !message.user }"
    >
      <div
        class="max-w-[75%] p-2 rounded-lg shadow-sm"
        [ngClass]="{
          'bg-blue-500 text-white self-end': message.user,
          'bg-white text-gray-800 self-start': !message.user
        }"
      >
        <p>{{ message.text }}</p>
      </div>
    </div>
  </div>

  <div class="input-box">
    <textarea 
      [(ngModel)]="userInput" 
      placeholder="Scrivi un messaggio..." 
      (keydown.enter)="sendMessage()" 
      rows="1"></textarea>
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

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Log per verificare l'iniezione di ChatService
    console.log('ChatService iniettato:', this.chatService);
  }

  sendMessage() {
    if (this.userInput.trim()) {
      console.log('Messaggio inviato:', this.userInput);
      this.messages.push({ user: true, text: this.userInput });
  
      this.chatService.sendMessage(this.userInput).subscribe(
        (response) => {
          console.log('Risposta dal backend:', response);
          
          // Accedi al primo oggetto nell'array 'responses' (poiché c'è solo un oggetto)
          if (response.responses && response.responses.length > 0) {
            this.messages.push({ user: false, text: response.responses[0].text });
          }
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