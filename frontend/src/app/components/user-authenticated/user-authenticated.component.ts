import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Servizio Auth
import { Router } from '@angular/router';
import { User } from '../../models/User'; 

@Component({
  selector: 'app-user-authenticated',
  standalone: true,
  templateUrl: './user-authenticated.component.html',
  styleUrls: ['./user-authenticated.component.scss']
})
export class UserAuthenticatedComponent {
  
  username: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUsername();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
