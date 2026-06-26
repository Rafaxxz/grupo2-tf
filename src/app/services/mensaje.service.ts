import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Mensaje } from '../models/mensaje.model';

const base_url = environment.base;

@Injectable({ providedIn: 'root' })
export class MensajeService {
  private url = `${base_url}/api/mensajes`;

  constructor(private http: HttpClient) {}

  list() { return this.http.get<Mensaje[]>(this.url); }
  getById(id: number) { return this.http.get<Mensaje>(`${this.url}/${id}`); }
  insert(m: Mensaje) { return this.http.post(`${this.url}/nuevo`, m); }
  update(m: Mensaje) { return this.http.put(`${this.url}/actualiza`, m); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
  getNoLeidos(destinatarioId: number) { return this.http.get<Mensaje[]>(`${this.url}/no-leidos/${destinatarioId}`); }
  getPorRemitente(remitenteId: number) { return this.http.get<Mensaje[]>(`${this.url}/por-remitente/${remitenteId}`); }
  getConversacion(usuario1: number, usuario2: number) { return this.http.get<Mensaje[]>(`${this.url}/conversacion?usuarioA=${usuario1}&usuarioB=${usuario2}`); }
  resumenNoLeidos(usuarioId: number) { return this.http.get<any>(`${this.url}/resumen-no-leidos/${usuarioId}`); }
}
