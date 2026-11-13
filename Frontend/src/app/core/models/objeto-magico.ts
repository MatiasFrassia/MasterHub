import { Conjuro } from './conjuro';

export interface ObjetoHabilidad {
  id: number;
  objeto_id: number;
  nombre: string;
  coste_cargas: number;
  tipo_accion?: string;
  descripcion: string;
}

export interface ObjetoConjuro extends Conjuro {
  coste_cargas: number;
  notas?: string;
}

export interface ObjetoMagico {
  id: number;
  nombre: string;
  tipo: string;
  rareza: string;
  sintonizacion: string;
  descripcion: string;
  cargas_maximas?: number | null;
  recuperacion_cargas?: string | null;
  habilidades?: ObjetoHabilidad[];
  conjuros?: ObjetoConjuro[];
  // Propiedades de estado en la mesa de combate
  idInstancia?: string;
  vinculadoA?: string;
  cargas_actuales?: number;
}