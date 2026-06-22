import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ContenidoEducativo } from '../models/contenido-educativo.model';

const base_url = environment.base;

@Injectable({ providedIn: 'root' })
export class ContenidoEducativoService {
  private url = `${base_url}/api/contenidos-educativos`;

  constructor(private http: HttpClient) {}

  list() { return this.http.get<ContenidoEducativo[]>(this.url); }
  getById(id: number) { return this.http.get<ContenidoEducativo>(`${this.url}/${id}`); }
  insert(c: ContenidoEducativo) { return this.http.post(this.url, c); }
  update(id: number, c: ContenidoEducativo) { return this.http.put(`${this.url}/${id}`, c); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
  getByTipo(tipo: string) { return this.http.get<ContenidoEducativo[]>(`${this.url}/tipo?tipo=${tipo}`); }
}
