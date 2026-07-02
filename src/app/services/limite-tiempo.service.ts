import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class LimiteTiempoService {
  private url = `${environment.base}/limites`;
  constructor(private http: HttpClient) {}

  list() { return this.http.get<any[]>(this.url); }

  getByUsuario(id: number) { return this.http.get<any[]>(`${this.url}/usuario/${id}`); }

  getBloqueados() { return this.http.get<any[]>(`${this.url}/bloqueados`); }

  // El backend espera la entidad con usuario anidado: { usuario: { idUsuario: X }, ... }
  insert(usuarioId: number, tipo: string, minutosMaximos: number, bloqueoActivo: boolean, notificar: boolean) {
    const body = {
      usuario: { idUsuario: usuarioId },
      tipo,
      minutosMaximos,
      bloqueoActivo,
      notificar
    };
    return this.http.post<any>(this.url, body);
  }

  update(id: number, usuarioId: number, tipo: string, minutosMaximos: number, bloqueoActivo: boolean, notificar: boolean) {
    const body = {
      idLimite: id,
      usuario: { idUsuario: usuarioId },
      tipo,
      minutosMaximos,
      bloqueoActivo,
      notificar
    };
    return this.http.put<any>(`${this.url}/${id}`, body);
  }

  toggleBloqueo(id: number, usuarioId: number, tipo: string, minutosMaximos: number, bloqueoActivo: boolean) {
    return this.update(id, usuarioId, tipo, minutosMaximos, bloqueoActivo, true);
  }
}
