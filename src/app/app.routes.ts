import { Routes } from '@angular/router';
import { Categorias } from './categorias/categorias';

export const routes: Routes = [
  { path: '', redirectTo: 'categorias', pathMatch: 'full' },
  { path: 'categorias', component: Categorias },
];
