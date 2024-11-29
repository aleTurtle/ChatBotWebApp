import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modello per le risposte dal backend
interface BotResponse {
  text: string; // Testo della risposta del bot
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // URL dell'API del tuo backend
  private apiUrl = 'http://localhost:3000/api/chat'; // endpoint  del tuo backend

  constructor(private http: HttpClient) {}

  // Metodo per inviare il messaggio dell'utente al backend
  sendMessage(userMessage: string): Observable<BotResponse[]> {
    // Corpo della richiesta da inviare al backend
    const payload = { message: userMessage };

    // Effettua la richiesta POST e ritorna un Observable
    return this.http.post<BotResponse[]>(this.apiUrl, payload);
  }
}
