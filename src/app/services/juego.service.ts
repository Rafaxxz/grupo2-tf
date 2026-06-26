import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Juego } from '../models/juego.model';

@Injectable({ providedIn: 'root' })
export class JuegoService {
  private url = `${environment.base}/juegos`;
  constructor(private http: HttpClient) {}

  list() { return this.http.get<Juego[]>(this.url); }
  getById(id: number) { return this.http.get<Juego>(`${this.url}/${id}`); }
  insert(j: Juego) { return this.http.post<Juego>(this.url, j); }
  porPlataforma(plataforma: string) { return this.http.get<Juego[]>(`${this.url}/plataforma?plataforma=${plataforma}`); }
  porCategoria(idCategoria: number) { return this.http.get<Juego[]>(`${this.url}/categoria/${idCategoria}`); }
}
