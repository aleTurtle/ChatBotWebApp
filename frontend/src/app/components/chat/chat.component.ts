import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'] 
})
export class ChatComponent {
  messages: { user: boolean; text: string }[] = [];
  userInput: string = '';

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ user: true, text: this.userInput });
      this.simulateBotResponse();
      this.userInput = '';
    }
  }

  simulateBotResponse() {
    setTimeout(() => {
      this.messages.push({ user: false, text: 'Risposta del chatbot...' });
    }, 1000);
  }
}
