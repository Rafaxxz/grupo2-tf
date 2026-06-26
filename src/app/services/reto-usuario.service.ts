import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { RetoUsuario } from '../models/reto-usuario.model';

@Injectable({ providedIn: 'root' })
export class RetoUsuarioService {
  private url = `${environment.base}/api/retos-usuario`;
  constructor(private http: HttpClient) {}

  list() { return this.http.get<RetoUsuario[]>(this.url); }
  getById(id: number) { return this.http.get<RetoUsuario>(`${this.url}/${id}`); }
  insert(r: RetoUsuario) { return this.http.post(`${this.url}/nuevo`, r); }
  update(r: RetoUsuario) { return this.http.put(`${this.url}/actualiza`, r); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
  porUsuario(usuarioId: number) { return this.http.get<RetoUsuario[]>(`${this.url}/por-usuario/${usuarioId}`); }
  porCompletado(usuarioId: number, completado: boolean) { return this.http.get<RetoUsuario[]>(`${this.url}/por-completado/${usuarioId}?completado=${completado}`); }
  dashboard(usuarioId: number) { return this.http.get<any>(`${this.url}/dashboard/${usuarioId}`); }
  completadosPorFecha(usuarioId: number) { return this.http.get<any>(`${this.url}/completados-por-fecha/${usuarioId}`); }
}
