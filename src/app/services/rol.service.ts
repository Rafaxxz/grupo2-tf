import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Rol } from '../models/rol.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  private url = `${environment.base}/api/roles`;
  constructor(private http: HttpClient) {}

  list() { return this.http.get<Rol[]>(this.url); }
  getById(id: number) { return this.http.get<Rol>(`${this.url}/${id}`); }
  insert(r: Rol) { return this.http.post<Rol>(this.url, r); }
  update(id: number, r: Rol) { return this.http.put<Rol>(`${this.url}/${id}`, r); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}
