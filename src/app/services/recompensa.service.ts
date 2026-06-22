import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Recompensa } from '../models/recompensa.model';

const base_url = environment.base;

@Injectable({ providedIn: 'root' })
export class RecompensaService {
  private url = `${base_url}/api/recompensas`;

  constructor(private http: HttpClient) {}

  list() { return this.http.get<Recompensa[]>(this.url); }
  getById(id: number) { return this.http.get<Recompensa>(`${this.url}/${id}`); }
  insert(r: Recompensa) { return this.http.post(this.url, r); }
  update(id: number, r: Recompensa) { return this.http.put(`${this.url}/${id}`, r); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}
