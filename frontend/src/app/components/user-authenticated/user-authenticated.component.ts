import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Servizio Auth
import { Router } from '@angular/router';
import { User } from '../../models/User'; 

@Component({
  selector: 'app-user-authenticated',
  standalone: true,
  //imports:[CommonModule]; oppure modifica il file ts 
  templateUrl: './user-authenticated.component.html',
  styleUrls: ['./user-authenticated.component.scss']
})
export class UserAuthenticatedComponent {
  user: User | null = null;

// riscrivo il costruttore anche considernado i casi peggiori
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

  //recupera il nome dell'utente
  get username(): string | null {
    return this.user?.username || null;
  }

  // genera l'icona dell'utente
  get userIcon(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '';
  }

  //effettua il logout
  logout(): void {
    try {
      this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }
}
