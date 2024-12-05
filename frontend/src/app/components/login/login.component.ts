import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Import del servizio AuthService
import { Router } from '@angular/router'; // Import di Router per la navigazione
//import { User } from '../../models/User'; // Import dell'interfaccia User
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: User = { username: '', password: '', role: '' }; // Oggetto user inizializzato

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Chiamata al servizio di autenticazione per effettuare il login
    this.authService.login(this.user.username, this.user.password).subscribe(
      (response) => {
        // Salviamo il token ricevuto dalla risposta del login
        this.authService.setToken(response.token);

        // Reindirizziamo l'utente alla rotta della chat
        this.router.navigate(['/chatbot']);  
      },
      (error) => {
        // Gestiamo gli errori (es. credenziali errate)
        alert('Errore di login: ' + error.message);
      }
    );
  }
}


export interface User {
  id?: number;
  username: string;
  password: string;
  role: string;
}
