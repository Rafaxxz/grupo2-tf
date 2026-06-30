import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class FamiliaService {
  private url = `${environment.base}/familia`;
  constructor(private http: HttpClient) {}

  vincular(email: string) {
    return this.http.post<Usuario>(`${this.url}/vincular`, { email });
  }

  listarHijos() {
    return this.http.get<Usuario[]>(`${this.url}/hijos`);
  }

  desvincular(id: number) {
    return this.http.delete<{ message: string }>(`${this.url}/hijos/${id}`);
  }
}
