import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Sidebar -->
    <div class="sidebar" [ngClass]="{ 'open': sidebarOpen }">
      <div class="sidebar-content">
        <!-- User Profile Section -->
        <div class="user-profile">
          <h3>Profilo Utente</h3>
          <div class="profile-info">
            <div class="profile-icon">{{ userIcon }}</div>
            <div class="profile-details">
              <p>{{ username }}</p>
            </div>
          </div>
        </div>

        <!-- Settings Section -->
        <div class="settings">
          <h3>Impostazioni</h3>
          <ul>
            <li (click)="navigateToSettings()">Modifica Profilo</li>
            <li (click)="navigateToProblem()">Segnala problema</li>
            <li (click)="navigateToPreferences()">Preferenze</li>
          </ul>
        </div>

        <!-- Conversation Section -->
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
        <button class="new-conversation" (click)="startNewConversation()">
        <span class= conversation icon>➕</span> Nuova Conversazione</button>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="chat-window" [ngClass]="chatWindowClass">
      <div class="messages" #messagesContainer>
        <div *ngFor="let message of messages; let i = index" [ngClass]="{ 'message': true, 'justify-end': message.user, 'justify-start': !message.user }">
          <div [ngClass]="{ 'user': message.user, 'bot': !message.user }">
            <div *ngIf="!message.user" class="chatbot-icon">
              <img src="assets/images/mondo3.png" alt="Chatbot Icon" />
            </div>
            <div class="message-text">
              <ng-container *ngIf="loadingIndex !== i; else loadingSpinner">
                {{ message.text }}
              </ng-container>
              <ng-template #loadingSpinner>
                <div class="spinner"></div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
      <div class="input-box">
        <textarea [(ngModel)]="userInput" placeholder="Scrivi un messaggio..." (keydown.enter)="sendMessage()" rows="1"></textarea>
        <button (click)="sendMessage()">
          <span class="send-icon">➤</span>
        </button>
        <button class="bottom-chat-button" (click)="scrollToBottom()">↓</button>
      </div>
    </div>
    <button class="sidebar-toggle-button" (click)="toggleSidebar()">☰</button>
  `,
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @Input() username: string | null = null;
  @Input() userIcon: string = '';


  messages = [{ user: false, text: 'Benvenuto! Come posso aiutarti oggi?' }];
  userInput = '';
  loading = false;
  loadingIndex: number | null = null;

  sidebarOpen = false; // Gestisce lo stato della sidebar
  chatWindowClass = { reduced: false, centered: true }; // Inizialmente la chat è centrata

  conversations: Array<{ id: number; name: string; messages: Array<{ user: boolean; text: string }> }> = [];
  activeConversationId: number | null = null;

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.startNewConversation();
    
  }

  setWelcomeMessage(username: string) {
    const welcomeMessage = `Benvenuto, ${username}! Come posso aiutarti oggi?`;
    this.messages[0] = { user: false, text: welcomeMessage };
    const currentConversation = this.conversations.find((c) => c.id === this.activeConversationId);
    if (currentConversation) {
      currentConversation.messages[0] = { user: false, text: welcomeMessage };
    }
  }



  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.chatWindowClass = this.sidebarOpen
      ? { reduced: true, centered: false }
      : { reduced: false, centered: true };
  }

  startNewConversation() {
    const newConversationId = this.conversations.length + 1;
    const newConversation = {
      id: newConversationId,
      name: `Conversazione ${newConversationId}`,
      messages: [{ user: false, text: 'Iniziamo una nuova conversazione!' }],
    };
    this.conversations.push(newConversation);
    this.activeConversationId = newConversationId;
    this.messages = newConversation.messages;
  }

  switchConversation(conversationId: number) {
    this.activeConversationId = conversationId;
    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (conversation) {
      this.messages = conversation.messages;
    }
  }

  closeConversation(conversationId: number) {
    this.conversations = this.conversations.filter((c) => c.id !== conversationId);
    if (this.activeConversationId === conversationId) {
      this.activeConversationId = null;
      this.messages = [];
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
          this.scrollToBottom();
        },
        () => {
          if (currentConversation) {
            currentConversation.messages[botIndex] = { user: false, text: 'Errore: il bot non è disponibile al momento.' };
          }
          this.loading = false;
          this.loadingIndex = null;
          this.scrollToBottom();
        }
      );
      this.userInput = '';
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      const nativeElement = this.messagesContainer.nativeElement;
      nativeElement.scrollTo({ top: nativeElement.scrollHeight, behavior: 'smooth' });
    }
  }

  navigateToSettings() {
    console.log('Navigazione alla sezione Impostazioni.');
  }

  navigateToPreferences() {
    console.log('Navigazione alla sezione Preferenze.');
  }

  navigateToProblem() {
      this.router.navigate(['/report-problem']);
    
  }
}
