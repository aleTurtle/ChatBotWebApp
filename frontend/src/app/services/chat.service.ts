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
  private apiUrl = '/webhooks/rest/webhook'; // Endpoint del server Rasa solo il percorso relativo dato che il resto è nel cors

  constructor(private http: HttpClient) {}

  // Metodo per inviare il messaggio al backend
  sendMessage(userMessage: string): Observable<BotResponse[]> {
    const payload = { message: userMessage }; // Corpo della richiesta
    return this.http.post<BotResponse[]>(this.apiUrl, payload);
  }
}
