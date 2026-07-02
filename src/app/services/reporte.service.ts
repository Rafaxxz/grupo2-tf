import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export interface Conteo { etiqueta: string; valor: number; }

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private url = `${environment.base}/api/reportes`;
  constructor(private http: HttpClient) {}

  usuariosPorRol() { return this.http.get<Conteo[]>(`${this.url}/usuarios-por-rol`); }
  especialistasPorModalidad() { return this.http.get<Conteo[]>(`${this.url}/especialistas-por-modalidad`); }
  juegosPorCategoria() { return this.http.get<Conteo[]>(`${this.url}/juegos-por-categoria`); }
  minutosPorUsuario() { return this.http.get<Conteo[]>(`${this.url}/minutos-por-usuario`); }
  recompensasMasCanjeadas() { return this.http.get<Conteo[]>(`${this.url}/recompensas-mas-canjeadas`); }
  logrosMasDesbloqueados() { return this.http.get<Conteo[]>(`${this.url}/logros-mas-desbloqueados`); }
  citasPorEstado() { return this.http.get<Conteo[]>(`${this.url}/citas-por-estado`); }
  contenidoPorTipo() { return this.http.get<Conteo[]>(`${this.url}/contenido-por-tipo`); }
}
