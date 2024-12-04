import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Sidebar -->
    <div class="sidebar" [ngClass]="{ 'open': sidebarOpen }">
      <div class="sidebar-content">
        <h3>Conversazioni</h3>
        <ul>
          <li
            *ngFor="let conversation of conversations"
            [class.active]="conversation.id === activeConversationId"
            (click)="switchConversation(conversation.id)"
          >
            {{ conversation.name }}
            <button class="close-conversation" (click)="closeConversation(conversation.id); $event.stopPropagation()">✖</button>
          </li>
        </ul>
        <button class="new-conversation" (click)="startNewConversation()">➕ Nuova Conversazione</button>
      </div>
    </div>

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
        <textarea [(ngModel)]="userInput" placeholder="Scrivi un messaggio..." (keydown.enter)="sendMessage()" rows="1"></textarea>
        <button (click)="sendMessage()">
          <span class="send-icon">➤</span>
        </button>
      </div>
    </div>

    <!-- Pulsante per aprire/chiudere la sidebar -->
    <button class="sidebar-toggle-button" (click)="toggleSidebar()">☰</button>
  `,
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit {
  messages = [{ user: false, text: 'Benvenuto! Come posso aiutarti oggi?' }];
  userInput = '';
  loading = false;
  loadingIndex: number | null = null;

  // Stato della sidebar
  sidebarOpen = false;

  // Gestione delle conversazioni
  conversations: Array<{ id: number; name: string; messages: Array<{ user: boolean; text: string }> }> = [];
  activeConversationId: number | null = null; // ID della conversazione attiva

  // Classe dinamica per la finestra di chat
  chatWindowClass = { reduced: true, centered: false };

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.startNewConversation(); // Inizializza una nuova conversazione all'avvio
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

  // Avvia una nuova conversazione
  startNewConversation() {
    const newConversationId = this.conversations.length + 1;
    const newConversation = {
      id: newConversationId,
      name: `Conversazione ${newConversationId}`,
      messages: [{ user: false, text: 'Nuova conversazione iniziata!' }],
    };
    this.conversations.push(newConversation);
    this.activeConversationId = newConversationId;
    this.messages = newConversation.messages;
  }

  // Passa a una conversazione esistente
  switchConversation(conversationId: number) {
    this.activeConversationId = conversationId;
    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (conversation) {
      this.messages = conversation.messages;
    }
  }

  // Chiude una conversazione (opzionale)
  closeConversation(conversationId: number) {
    this.conversations = this.conversations.filter((c) => c.id !== conversationId);
    if (this.activeConversationId === conversationId) {
      this.activeConversationId = null;
      this.messages = []; // Resetta i messaggi
    }
  }

  sendMessage() {
    if (this.userInput.trim()) {
      const currentConversation = this.conversations.find((c) => c.id === this.activeConversationId);
      if (currentConversation) {
        currentConversation.messages.push({ user: true, text: this.userInput });
      }

      const botIndex = this.messages.length;
      this.messages.push({ user: false, text: '' });
      this.loadingIndex = botIndex;
      this.loading = true;

      this.chatService.sendMessage(this.userInput).subscribe(
        (response) => {
          if (currentConversation) {
            currentConversation.messages[botIndex] = { user: false, text: response.responses[0]?.text || 'Errore di risposta' };
          }
          this.loading = false;
          this.loadingIndex = null;
        },
        () => {
          if (currentConversation) {
            currentConversation.messages[botIndex] = { user: false, text: 'Errore: il bot non è disponibile al momento.' };
          }
          this.loading = false;
          this.loadingIndex = null;
        }
      );
      this.userInput = '';
    }
  }
}
