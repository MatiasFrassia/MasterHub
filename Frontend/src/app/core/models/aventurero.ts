export interface AventureroClase {
  id?: number;
  clase: string;
  subclase?: string;
  nivel: number;
}

export interface Aventurero {
  id?: number;
  nombre: string;
  raza: string;
  clases: AventureroClase[]; // <-- Múltiples clases
  alineamiento: string;
  url_imagen?: string;
  imagenes_galeria?: string[];
  nivel: number; // Nivel total del personaje
  clase_armadura: number;
  hp_actual: number;
  hp_maximo: number;
  descripcion?: string;
}