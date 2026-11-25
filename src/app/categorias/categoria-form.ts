import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriasService } from '../services/categorias';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-categoria-form',
  styleUrl: './categoria-form.scss',
  templateUrl: './categoria-form.html',
})
export class CategoriaForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoriasService = inject(CategoriasService);

  error = signal('');
  enviando = signal(false);
  esEdicion = false;
  private idEditar: number | null = null;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.idEditar = Number(id);
      this.categoriasService.getOne(this.idEditar).subscribe({
        next: (categoria) => this.form.patchValue({ nombre: categoria.nombre }),
        error: (err) => this.error.set(err?.error?.message ?? 'No se pudo cargar la categoría.'),
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('El nombre es obligatorio (máximo 50 caracteres).');
      return;
    }

    this.enviando.set(true);
    this.error.set('');
    const nombre = this.form.value.nombre ?? '';
    const peticion = this.esEdicion && this.idEditar !== null
      ? this.categoriasService.update(this.idEditar, nombre)
      : this.categoriasService.create(nombre);

    peticion.subscribe({
      next: () => this.router.navigate(['/categorias']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'No se pudo guardar la categoría.');
        this.enviando.set(false);
      },
    });
  }
}
