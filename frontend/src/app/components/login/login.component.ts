import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule per ngModel e ngForm

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule], // Aggiungi i moduli necessari
})
export class LoginComponent {
  email = '';
  password = '';

  onSubmit() {
    if (this.email && this.password) {
      console.log('Login attempt:', this.email, this.password);
      // Effettua una chiamata al servizio di autenticazione
    } else {
      console.error('Form non valido!');
    }
  }
}
