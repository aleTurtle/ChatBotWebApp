import { Component, Input ,Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports:[CommonModule],
  template: `
    <div class="sidebar" [ngClass]="{ 'open': sidebarOpen }">
      <div class="sidebar-content">
        <!-- User Profile Section -->
        <div class="user-profile">
          <h3>Profilo Utente</h3>
          <div class="profile-info">
            <div class="profile-icon" (click)="toggleProfile()">{{ userIcon }}</div>
            
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
        <button class="view-messages" (click)="viewUserMessages()">
  📋 Visualizza Messaggi Utente
</button>
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
          <span class="conversation icon">➕</span> Nuova Conversazione
        </button>

      </div>
    </div>

    <!-- Modal Profilo -->
<div class="user-profile-modal" *ngIf="showProfile">
  <div class="profile-header">
    Profilo Utente
    <button class="close-profile" (click)="toggleProfile()">✖</button>
  </div>
  <div class="profile-content">
    <div class="profile-icon">{{ userIcon }}</div>
    <p><strong>Nome utente</strong>: {{ username }}</p>
    <p><strong>Ruolo:</strong> {{ role }}</p>
  </div>
</div>
    <button class="sidebar-toggle-button" (click)="toggleSidebar()">☰</button>
    <!-- New Button to View Messages -->

  `,
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() username: string | null = null;
  @Input() role: string | null = null;
  @Input() userIcon: string = '';
  @Input() conversations: Array<{ id: number; name: string }> = [];
  @Input() activeConversationId: number | null = null;

  @Output() userMessagesRequested = new EventEmitter<void>(); // Output Event

  sidebarOpen = false;
  showProfile=false;
  constructor(private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleProfile(){
    this.showProfile=!this.showProfile;
  }

  startNewConversation() {
    // Logic to start a new conversation (useful for the parent component to handle)
  }

  switchConversation(conversationId: number) {
    // Logic to switch to a conversation
  }

  closeConversation(conversationId: number) {
    // Logic to close a conversation
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


  viewUserMessages() {
    console.log('Visualizzazione dei messaggi dell\'utente.');
    this.userMessagesRequested.emit(); // Emissione dell'evento
  }
/*
 setUsername(username:string){
    this.username =  username;
  }
*/
}
