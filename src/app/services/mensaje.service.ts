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
  insert(m: Mensaje) { return this.http.post(this.url, m); }
  update(id: number, m: Mensaje) { return this.http.put(`${this.url}/${id}`, m); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
  getNoLeidos(usuarioId: number) { return this.http.get<Mensaje[]>(`${this.url}/no-leidos/${usuarioId}`); }
}
