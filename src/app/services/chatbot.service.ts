import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ChatMensaje, ChatRespuesta, ChatHistorial } from '../models/chat.model';

// El JWT lo agrega automáticamente el authInterceptor existente (Authorization: Bearer ...)
@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private url = `${environment.base}/api/chatbot`;

  constructor(private http: HttpClient) {}

  preguntar(body: ChatMensaje) {
    return this.http.post<ChatRespuesta>(`${this.url}/preguntar`, body);
  }

  getHistorial(idUsuario: number) {
    return this.http.get<ChatHistorial[]>(`${this.url}/historial/${idUsuario}`);
  }
}
