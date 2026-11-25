import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Categoria } from '../models/categoria.interface';
import { RecetaData } from '../models/receta.interface';
import { CategoriasService } from '../services/categorias';
import { RecetasService } from '../services/recetas';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-receta-form',
  styleUrl: './receta-form.scss',
  templateUrl: './receta-form.html',
})
export class RecetaForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recetasService = inject(RecetasService);
  private categoriasService = inject(CategoriasService);

  categorias = signal<Categoria[]>([]);
  error = signal('');
  enviando = signal(false);
  esEdicion = false;
  private idEditar: number | null = null;

  form = this.fb.group({
    idCategoria: [0, [Validators.required, Validators.min(1)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    tiempo: [1, [Validators.required, Validators.min(1)]],
    ingredientes: ['', Validators.required],
    preparacion: ['', Validators.required],
    porciones: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.categoriasService.getAll().subscribe({
      next: (datos) => this.categorias.set(datos),
      error: () => this.error.set('No se pudieron cargar las categorías.'),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.idEditar = Number(id);
      this.recetasService.getOne(this.idEditar).subscribe({
        next: (receta) => {
          this.form.patchValue({
            idCategoria: receta.categoria.id,
            nombre: receta.nombre,
            tiempo: receta.tiempo,
            ingredientes: receta.ingredientes,
            preparacion: receta.preparacion,
            porciones: receta.porciones,
          });
        },
        error: (err) => this.error.set(err?.error?.message ?? 'No se pudo cargar la receta.'),
      });
    }
  }

  campoInvalido(nombre: string): boolean {
    const control = this.form.get(nombre);
    return !!control && control.invalid && control.touched;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Revisá los campos marcados.');
      return;
    }

    this.enviando.set(true);
    this.error.set('');
    const datos = this.form.getRawValue() as RecetaData;
    const peticion = this.esEdicion && this.idEditar !== null
      ? this.recetasService.update(this.idEditar, datos)
      : this.recetasService.create(datos);

    peticion.subscribe({
      next: () => this.router.navigate(['/recetas']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'No se pudo guardar la receta.');
        this.enviando.set(false);
      },
    });
  }
}
