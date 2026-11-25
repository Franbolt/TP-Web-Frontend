import { Routes } from '@angular/router';
import { Categorias } from './categorias/categorias';
import { Recetas } from './recetas/recetas';

export const routes: Routes = [
  { path: '', redirectTo: 'categorias', pathMatch: 'full' },
  { path: 'categorias', component: Categorias },
  { path: 'recetas', component: Recetas },
];
