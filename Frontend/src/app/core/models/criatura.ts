import { Conjuro } from './conjuro';

export interface Accion {
  id: number;
  criatura_id: number;
  nombre: string;
  descripcion: string;
  tipo: 'rasgo' | 'accion' | 'accion_bonificada' | 'reaccion' | 'accion_legendaria';
  uso_limitado?: string;
}

export interface EspacioConjuro {
  id: number;
  criatura_id: number;
  nivel: number;
  cantidad_maxima: number;
  cantidad_actual: number;
}

export interface CriaturaResumen {
  id: number;
  nombre: string;
  desafio: string;
  clase_armadura: number;
  puntos_golpe: number;
  url_imagen: string;
  resistencias?: string;
  inmunidades_dano?: string;
  vulnerabilidades?: string;
  destreza: number; 
  puntos_experiencia?: number;
}

export interface CriaturaCompleta extends CriaturaResumen {
  tamano: string;
  tipo: string;
  alineamiento: string;
  detalle_armadura?: string;
  dado_golpe: string;
  velocidad: Record<string, string> | string;
  fuerza: number;
  destreza: number;
  constitucion: number;
  inteligencia: number;
  sabiduria: number;
  carisma: number;
  tiradas_salvacion?: Record<string, string> | string;
  habilidades?: Record<string, string> | string;
  vulnerabilidades?: string;
  resistencias?: string;
  inmunidades_dano?: string;
  inmunidades_estado?: string;
  sentidos?: string;
  idiomas?: string;
  puntos_experiencia: number;
  acciones?: Accion[];
  conjuros?: Conjuro[];
  espacios_conjuros?: EspacioConjuro[];
  historia?: string;
  imagenes_galeria?: string[];
}