import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private url = `${environment.base}/api/usuarios`;
  constructor(private http: HttpClient) {}
  list() { return this.http.get<Usuario[]>(this.url); }
  getById(id: number) { return this.http.get<Usuario>(`${this.url}/${id}`); }
  insert(u: Usuario) { return this.http.post<Usuario>(this.url, u); }
  update(id: number, u: Usuario) { return this.http.put<Usuario>(`${this.url}/${id}`, u); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
  getByRol(nombre: string) { return this.http.get<Usuario[]>(`${this.url}/userByRol?nombre=${nombre}`); }
  userLastDays() { return this.http.get<Usuario[]>(`${this.url}/userLastDays`); }
}
