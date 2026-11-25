import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categoria } from '../models/categoria.interface';
import { CategoriasService } from '../services/categorias';

@Component({
  imports: [RouterLink],
  selector: 'app-categorias',
  styleUrl: './categorias.scss',
  templateUrl: './categorias.html',
})
export class Categorias implements OnInit {
  private categoriasService = inject(CategoriasService);

  categorias = signal<Categoria[]>([]);
  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  borrar(id: number): void {
    if (!confirm('¿Borrar la categoría ' + id + '?')) return;
    this.categoriasService.remove(id).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(err?.error?.message ?? 'No se pudo borrar la categoría.'),
    });
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.categoriasService.getAll().subscribe({
      next: (datos) => {
        this.categorias.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías. Intentá de nuevo.');
        this.cargando.set(false);
      },
    });
  }
}
