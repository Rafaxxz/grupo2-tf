import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Alerta } from '../models/alerta.model';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private url = `${environment.base}/alertas`;
  constructor(private http: HttpClient) {}
  list() { return this.http.get<Alerta[]>(this.url); }
  getByUsuario(id: number) { return this.http.get<Alerta[]>(`${this.url}/usuario/${id}`); }
  getNoLeidas() { return this.http.get<Alerta[]>(`${this.url}/no-leidas`); }
  insert(a: Alerta) { return this.http.post<Alerta>(this.url, a); }
  marcarLeida(id: number) { return this.http.patch<{ message: string }>(`${this.url}/${id}/leer`, {}); }
}
