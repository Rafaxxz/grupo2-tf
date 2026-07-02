import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CitaEspecialista } from '../models/cita-especialista.model';

const base_url = environment.base;

@Injectable({ providedIn: 'root' })
export class CitaEspecialistaService {
  private url = `${base_url}/api/citas-especialista`;

  constructor(private http: HttpClient) {}

  list() { return this.http.get<CitaEspecialista[]>(this.url); }
  getById(id: number) { return this.http.get<CitaEspecialista>(`${this.url}/${id}`); }
  insert(c: CitaEspecialista) { return this.http.post(this.url, c); }
  update(id: number, c: CitaEspecialista) { return this.http.put(`${this.url}/${id}`, c); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
  getByUsuario(usuarioId: number) { return this.http.get<CitaEspecialista[]>(`${this.url}/usuario/${usuarioId}`); }
}
