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
  insert(r: Recompensa) { return this.http.post(`${this.url}/nuevo`, r); }
  update(r: Recompensa) { return this.http.put(`${this.url}/actualiza`, r); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }

  porTipo(tipo: string) { return this.http.get<Recompensa[]>(`${this.url}/por-tipo?tipo=${tipo}`); }
  disponiblesPorPuntos(puntos: number) { return this.http.get<Recompensa[]>(`${this.url}/disponibles-por-puntos?puntosDisponibles=${puntos}`); }
  estadisticasPorTipo() { return this.http.get<any>(`${this.url}/estadisticas-por-tipo`); }
}
