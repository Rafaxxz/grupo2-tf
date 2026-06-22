import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Reto } from '../models/reto.model';

const base_url = environment.base;

@Injectable({ providedIn: 'root' })
export class RetoService {
  private url = `${base_url}/api/retos`;

  constructor(private http: HttpClient) {}

  list() { return this.http.get<Reto[]>(this.url); }
  getById(id: number) { return this.http.get<Reto>(`${this.url}/${id}`); }
  insert(r: Reto) { return this.http.post(this.url, r); }
  update(id: number, r: Reto) { return this.http.put(`${this.url}/${id}`, r); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}
