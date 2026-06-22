import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Livingroom } from '../models/Livingroom';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Livingservice {
  private url = `${base_url}/api-salas`;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Livingroom[]>(`${this.url}/lista`);
  }

  insert(l: Livingroom) {
    return this.http.post(`${this.url}/nuevo`, l);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<Livingroom>(`${this.url}/${id}`);
  }

  update(lv: Livingroom) {
    return this.http.put(`${this.url}/actualiza`, lv,{responseType:'text'});
  }
}
