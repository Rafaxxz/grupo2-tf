import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CanjeRecompensa } from '../models/canje-recompensa.model';

@Injectable({ providedIn: 'root' })
export class CanjeRecompensaService {
  private url = `${environment.base}/api/canjes`;
  constructor(private http: HttpClient) {}

  list() { return this.http.get<CanjeRecompensa[]>(this.url); }
  getById(id: number) { return this.http.get<CanjeRecompensa>(`${this.url}/${id}`); }
  insert(c: CanjeRecompensa) { return this.http.post(`${this.url}/nuevo`, c); }
  update(c: CanjeRecompensa) { return this.http.put(`${this.url}/actualiza`, c); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
  porUsuario(usuarioId: number) { return this.http.get<CanjeRecompensa[]>(`${this.url}/por-usuario/${usuarioId}`); }
  puntosGastados(usuarioId: number) { return this.http.get<any>(`${this.url}/puntos-gastados/${usuarioId}`); }
  balance(usuarioId: number) { return this.http.get<any>(`${this.url}/balance/${usuarioId}`); }
  historialVsDisponibles(usuarioId: number) { return this.http.get<any>(`${this.url}/historial-vs-disponibles/${usuarioId}`); }
}
