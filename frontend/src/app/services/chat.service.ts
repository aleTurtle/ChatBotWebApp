import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

interface BotResponse {
  responses: { text: string }[]; 
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(private http: HttpClient) {}

  sendMessage(userMessage: string): Observable<BotResponse> {
    const payload = { message: userMessage };
    return this.http.post<BotResponse>(environment.baseUrl+'/api/chat', payload);  // Chiamata al proxy, che sarà reindirizzata a localhost:3000/chat
  }
}
