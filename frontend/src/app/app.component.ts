import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importante per ngModel
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from './components/chatbot/chatbot.component'; // Assicurati che il componente sia già presente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ChatbotComponent], // Import dei moduli necessari e dei componenti
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  // Proprietà per memorizzare il messaggio dell'utente
  userMessage: string = '';

  // Proprietà per memorizzare la lista dei messaggi
  messages: { sender: string, content: string }[] = [
    { sender: 'Chatbot', content: 'Ciao, come posso aiutarti oggi?' }
  ];

  // Funzione per inviare il messaggio
  sendMessage() {
    if (this.userMessage.trim()) {
      // Aggiungi il messaggio dell'utente alla lista dei messaggi
      this.messages.push({ sender: 'Tu', content: this.userMessage });

      // Simula una risposta del chatbot (puoi sostituirlo con la logica del tuo chatbot)
      setTimeout(() => {
        this.messages.push({ sender: 'Chatbot', content: 'Risposta automatica...' });
      }, 1000);

      // Pulisci il campo di input
      this.userMessage = '';
    }
  }
}
