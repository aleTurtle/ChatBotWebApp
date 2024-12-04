import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../../models/AuthResponse'; 
import {AuthError} from '../../models/AuthError';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input type="text" [(ngModel)]="username" placeholder="Username" name="username" required />
      <input type="password" [(ngModel)]="password" placeholder="Password" name="password" required />
      <button type="submit">Login</button>
    </form>
  `,
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      (response: AuthResponse) => { 
        this.authService.setToken(response.token);
        this.router.navigate(['/chat']); // Redirigi alla chat
      },
      (error: AuthError) => {
        alert('Errore: ' + error.error.message);
      }
    );
  }
}
