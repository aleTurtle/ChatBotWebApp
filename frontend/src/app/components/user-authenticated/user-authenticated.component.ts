import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-user-authenticated',
  standalone: true,
  templateUrl: './user-authenticated.component.html',
  styleUrls: ['./user-authenticated.component.scss'],
  imports: [ChatbotComponent],
})
export class UserAuthenticatedComponent implements AfterViewInit {
  user: User | null = null;

  @ViewChild(ChatbotComponent) chatbotComponent!: ChatbotComponent;

  constructor(private authService: AuthService, private router: Router) {
    try {
      this.user = this.authService.getAuthenticatedUser();
      if (!this.user) {
        console.log('Nessun utente autenticato trovato. Reindirizzamento a login.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'utente autenticato:', error);
    }
  }

  ngAfterViewInit() {
    if (this.chatbotComponent && this.user?.username) {
      this.chatbotComponent.setWelcomeMessage(this.user.username);
    }
  }

  get username(): string | null {
    return this.user?.username || null;
  }

  get userIcon(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '';
  }

  logout(): void {
    try {
      this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }
}
