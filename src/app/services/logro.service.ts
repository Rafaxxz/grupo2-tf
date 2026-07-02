import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Logro } from '../models/logro.model';

const base_url = environment.base;

@Injectable({ providedIn: 'root' })
export class LogroService {
  private url = `${base_url}/api/logros`;

  constructor(private http: HttpClient) {}

  list() { return this.http.get<Logro[]>(this.url); }
  getById(id: number) { return this.http.get<Logro>(`${this.url}/${id}`); }
  insert(l: Logro) { return this.http.post(`${this.url}/nuevo`, l); }
  update(l: Logro) { return this.http.put(`${this.url}/actualiza`, l); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }

  // Endpoints de consulta del backend
  porCriterio(criterio: string) { return this.http.get<Logro[]>(`${this.url}/por-criterio?criterio=${criterio}`); }
  criterioOrdenado() { return this.http.get<Logro[]>(`${this.url}/criterio-ordenado`); }
  estadisticasDesbloqueos() { return this.http.get<any>(`${this.url}/estadisticas-desbloqueos`); }
}
