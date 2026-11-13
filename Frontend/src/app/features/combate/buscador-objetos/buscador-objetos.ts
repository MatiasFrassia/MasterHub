import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObjetoMagico } from '../../../core/models/objeto-magico';
import { ObjetosMagicosService } from '../../../core/services/objetos-magicos.service';

@Component({
  selector: 'app-buscador-objetos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador-objetos.html',
  styleUrl: './buscador-objetos.css'
})
export class BuscadorObjetosComponent implements OnInit {
  private objetosService = inject(ObjetosMagicosService);

  @Output() objetoSeleccionado = new EventEmitter<ObjetoMagico>();

  busqueda = '';
  objetos: ObjetoMagico[] = [];
  resultadosFiltrados: ObjetoMagico[] = [];
  mostrarDropdown = false;

  ngOnInit(): void {
    this.objetosService.getObjetosMagicos().subscribe({
      next: (data) => (this.objetos = data),
      error: (err) => console.error('Error al cargar objetos mágicos:', err)
    });
  }

  filtrar(): void {
    const termino = this.busqueda.trim().toLowerCase();
    if (!termino) {
      this.resultadosFiltrados = [];
      this.mostrarDropdown = false;
      return;
    }

    this.resultadosFiltrados = this.objetos
      .filter(obj =>
        obj.nombre.toLowerCase().includes(termino) ||
        obj.tipo.toLowerCase().includes(termino) ||
        obj.rareza.toLowerCase().includes(termino)
      )
      .slice(0, 10);

    this.mostrarDropdown = true;
  }

  seleccionar(objeto: ObjetoMagico): void {
    this.objetoSeleccionado.emit({ ...objeto });
    this.busqueda = '';
    this.resultadosFiltrados = [];
    this.mostrarDropdown = false;
  }

  cerrarDropdown(): void {
    setTimeout(() => {
      this.mostrarDropdown = false;
    }, 150);
  }
}
