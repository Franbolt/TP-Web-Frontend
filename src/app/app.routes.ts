import { Routes } from '@angular/router';
import { Categorias } from './categorias/categorias';
import { CategoriaForm } from './categorias/categoria-form';
import { Recetas } from './recetas/recetas';
import { RecetaForm } from './recetas/receta-form';

export const routes: Routes = [
  { path: '', redirectTo: 'categorias', pathMatch: 'full' },
  { path: 'categorias', component: Categorias },
  { path: 'categorias/nueva', component: CategoriaForm },
  { path: 'categorias/:id/editar', component: CategoriaForm },
  { path: 'recetas', component: Recetas },
  { path: 'recetas/nueva', component: RecetaForm },
  { path: 'recetas/:id/editar', component: RecetaForm },
];
