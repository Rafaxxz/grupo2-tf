import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { LogroUsuario } from '../models/logro-usuario.model';

@Injectable({ providedIn: 'root' })
export class LogroUsuarioService {
  private url = `${environment.base}/api/logros-usuario`;
  constructor(private http: HttpClient) {}

  list() { return this.http.get<LogroUsuario[]>(this.url); }
  getById(id: number) { return this.http.get<LogroUsuario>(`${this.url}/${id}`); }
  insert(l: LogroUsuario) { return this.http.post(`${this.url}/nuevo`, l); }
  update(l: LogroUsuario) { return this.http.put(`${this.url}/actualiza`, l); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
  porUsuario(usuarioId: number) { return this.http.get<LogroUsuario[]>(`${this.url}/por-usuario/${usuarioId}`); }
  conteo(usuarioId: number) { return this.http.get<any>(`${this.url}/conteo/${usuarioId}`); }
  dashboard(usuarioId: number) { return this.http.get<any>(`${this.url}/dashboard/${usuarioId}`); }
  timeline(usuarioId: number) { return this.http.get<any>(`${this.url}/timeline/${usuarioId}`); }
}
