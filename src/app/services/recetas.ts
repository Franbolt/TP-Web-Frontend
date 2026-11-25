import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta.interface';

@Service()
export class RecetasService {
  private readonly apiUrl = 'http://localhost:3000/recetas';

  private http = inject(HttpClient);

  getAll(): Observable<Receta[]> {
    return this.http.get<Receta[]>(this.apiUrl);
  }

  getByCategoria(idCategoria: number): Observable<Receta[]> {
    return this.http.get<Receta[]>(this.apiUrl, {
      params: { categoria: idCategoria },
    });
  }

  getOne(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.apiUrl}/${id}`);
  }

  create(receta: Omit<Receta, 'id'>): Observable<Receta> {
    return this.http.post<Receta>(this.apiUrl, receta);
  }

  update(id: number, receta: Partial<Receta>): Observable<Receta> {
    return this.http.put<Receta>(`${this.apiUrl}/${id}`, receta);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
