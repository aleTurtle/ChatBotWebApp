import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule per ngModel
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Supponiamo che tu abbia un servizio AuthService

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  user = { username: '', password: '', role: '' }; // Oggetto user inizializzato

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Logica per la registrazione (puoi implementare un servizio per registrare l'utente)
    this.authService.signUp(this.user.username, this.user.password).subscribe(
      (response) => {
        // Gestisci la risposta, salva il token, e fai il redirect
        alert('Registrazione riuscita!');
        this.router.navigate(['/login']); // Redirigi al login
      },
      (error) => {
        // Gestisci gli errori
        alert('Errore di registrazione: ' + error.message);
      }
    );
  }
}
