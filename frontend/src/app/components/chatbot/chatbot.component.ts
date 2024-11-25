import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  messages: { user: boolean; text: string }[] = []; // Array dei messaggi
  userInput: string = ''; // Input dell'utente

  // Invia un messaggio
  sendMessage() {
    if (this.userInput.trim()) {
      // Aggiunge il messaggio dell'utente
      this.messages.push({ user: true, text: this.userInput });

      // Simula la risposta del bot
      this.simulateBotResponse();

      // Svuota l'input
      this.userInput = '';
    }
  }

  // Risposta simulata del bot
  simulateBotResponse() {
    setTimeout(() => {
      this.messages.push({ user: false, text: 'Risposta del bot...' });
    }, 1000);
  }
}
