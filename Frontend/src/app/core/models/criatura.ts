import { Conjuro } from './conjuro';

export interface Accion {
  id: number;
  criatura_id: number;
  nombre: string;
  descripcion: string;
  tipo: 'rasgo' | 'accion' | 'accion_bonificada' | 'reaccion' | 'accion_legendaria';
  uso_limitado?: string;
}

// Modelo ligero para el buscador y las tarjetas del panel de combate
export interface CriaturaResumen {
  id: number;
  nombre: string;
  desafio: string;
  clase_armadura: number;
  puntos_golpe: number;
  url_imagen: string;
}

// Modelo completo para la tarjeta emergente (hover)
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
  sentidos?: string;
  idiomas?: string;
  puntos_experiencia: number;
  acciones?: Accion[];
  conjuros?: Conjuro[];
}