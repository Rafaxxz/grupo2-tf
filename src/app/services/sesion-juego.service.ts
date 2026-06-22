import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { SesionJuego } from '../models/sesion-juego.model';

@Injectable({ providedIn: 'root' })
export class SesionJuegoService {
  private url = `${environment.base}/sesiones`;
  constructor(private http: HttpClient) {}

  list() { return this.http.get<SesionJuego[]>(this.url); }
  getById(id: number) { return this.http.get<SesionJuego>(`${this.url}/${id}`); }
  insert(s: SesionJuego) { return this.http.post<SesionJuego>(this.url, s); }
  historial(usuarioId: number) { return this.http.get<SesionJuego[]>(`${this.url}/historial/${usuarioId}`); }
  porUsuario(usuarioId: number) { return this.http.get<SesionJuego[]>(`${this.url}/usuario/${usuarioId}`); }
  porJuego(juegoId: number) { return this.http.get<SesionJuego[]>(`${this.url}/juego/${juegoId}`); }
  porUsuarioYJuego(usuarioId: number, juegoId: number) { return this.http.get<SesionJuego[]>(`${this.url}/usuario/${usuarioId}/juego/${juegoId}`); }
  porFecha(fecha: string) { return this.http.get<SesionJuego[]>(`${this.url}/fecha?fecha=${fecha}`); }
}
