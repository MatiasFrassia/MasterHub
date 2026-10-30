export interface Conjuro {
  id: number;
  nombre: string;
  nivel: number;
  escuela?: string;
  tiempo_casteo?: string;
  alcance?: string;
  componentes?: string;
  duracion?: string;
  descripcion: string;
  modalidad?: string; // Viene de la tabla intermedia criatura_conjuros
}
