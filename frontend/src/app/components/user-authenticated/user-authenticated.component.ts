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


  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getAuthenticatedUser();
  }

  get username(): string | null {
    return this.user?.username || null;
  }

  get userIcon(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
