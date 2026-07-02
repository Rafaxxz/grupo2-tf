import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private url = `${environment.base}/api/consultas`;
  constructor(private http: HttpClient) {}

  private get(endpoint: string, q: string) {
    return this.http.get<any[]>(`${this.url}/${endpoint}`, { params: new HttpParams().set('q', q) });
  }

  usuariosPorRol(q: string) { return this.get('usuarios-por-rol', q); }
  especialistasPorNombre(q: string) { return this.get('especialistas-por-nombre', q); }
  juegosPorCategoria(q: string) { return this.get('juegos-por-categoria', q); }
  sesionesPorUsuario(q: string) { return this.get('sesiones-por-usuario', q); }
  logrosPorUsuario(q: string) { return this.get('logros-por-usuario', q); }
  canjesPorRecompensa(q: string) { return this.get('canjes-por-recompensa', q); }
  retosPorUsuario(q: string) { return this.get('retos-por-usuario', q); }
  citasPorEstado(q: string) { return this.get('citas-por-estado', q); }
}
