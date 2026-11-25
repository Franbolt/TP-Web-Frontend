import { Component, OnInit, inject, signal } from '@angular/core';
import { Categoria } from '../models/categoria.interface';
import { Receta } from '../models/receta.interface';
import { CategoriasService } from '../services/categorias';
import { RecetasService } from '../services/recetas';

@Component({
  imports: [],
  selector: 'app-recetas',
  styleUrl: './recetas.scss',
  templateUrl: './recetas.html',
})
export class Recetas implements OnInit {
  private recetasService = inject(RecetasService);
  private categoriasService = inject(CategoriasService);

  recetas = signal<Receta[]>([]);
  categorias = signal<Categoria[]>([]);
  categoriaSeleccionada = signal<number | null>(null);
  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarRecetas();
  }

  cargarCategorias(): void {
    this.categoriasService.getAll().subscribe({
      next: (datos) => this.categorias.set(datos),
      error: () => this.error.set('No se pudieron cargar las categorías.'),
    });
  }

  cargarRecetas(): void {
    this.cargando.set(true);
    this.error.set('');
    const id = this.categoriaSeleccionada();
    const peticion = id === null
      ? this.recetasService.getAll()
      : this.recetasService.getByCategoria(id);

    peticion.subscribe({
      next: (datos) => {
        this.recetas.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las recetas. Intentá de nuevo.');
        this.cargando.set(false);
      },
    });
  }

  alCambiarCategoria(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    this.categoriaSeleccionada.set(valor ? Number(valor) : null);
    this.cargarRecetas();
  }
}
