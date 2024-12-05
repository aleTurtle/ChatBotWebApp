import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule per ngModel

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User = { username: '', password: '', role: '' }; // Oggetto user inizializzato

  constructor() {}

  onSubmit() {
    // Gestire la logica di invio del form (da implementare eventualmente con un servizio di login)
    console.log(this.user);
    alert(`Login con: ${this.user.username}`);
  }
}

export interface User {
  id?: number;
  username: string;
  password: string;
  role: string;
}
