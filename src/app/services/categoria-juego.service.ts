import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CategoriaJuego } from '../models/categoria-juego.model';

@Injectable({ providedIn: 'root' })
export class CategoriaJuegoService {
  private url = `${environment.base}/categorias-juego`;
  constructor(private http: HttpClient) {}

  list() { return this.http.get<CategoriaJuego[]>(this.url); }
  insert(c: CategoriaJuego) { return this.http.post<CategoriaJuego>(this.url, c); }
  buscarPorNombre(nombre: string) { return this.http.get<CategoriaJuego[]>(`${this.url}/buscar?nombre=${nombre}`); }
  existePorNombre(nombre: string) { return this.http.get<boolean>(`${this.url}/existe?nombre=${nombre}`); }
}
