import { Categoria } from './categoria.interface';

export interface Receta {
  id: number;
  nombre: string;
  tiempo: number;
  ingredientes: string;
  preparacion: string;
  porciones: number;
  categoria: Categoria;
}
