import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Especialista } from '../models/especialista.model';

@Injectable({ providedIn: 'root' })
export class EspecialistaService {
  private url = `${environment.base}/api/especialistas`;
  constructor(private http: HttpClient) {}
  list() { return this.http.get<Especialista[]>(this.url); }
  listVerificados() { return this.http.get<Especialista[]>(`${this.url}/verificados`); }
  getById(id: number) { return this.http.get<Especialista>(`${this.url}/${id}`); }
  insert(e: Especialista) { return this.http.post<Especialista>(this.url, e); }
  update(id: number, e: Especialista) { return this.http.put<Especialista>(`${this.url}/${id}`, e); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}
