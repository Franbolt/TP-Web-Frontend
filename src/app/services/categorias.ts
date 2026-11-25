import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../models/categoria.interface';

@Service()
export class CategoriasService {
  private readonly apiUrl = environment.apiUrl + '/categorias';

  private http = inject(HttpClient);

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getOne(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  create(nombre: string): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, { nombre });
  }

  update(id: number, nombre: string): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, { nombre });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
