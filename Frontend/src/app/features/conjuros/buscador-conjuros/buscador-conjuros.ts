import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay'; 

import { Conjuro } from '../../../core/models/conjuro';
import { TarjetaConjuroComponent } from '../../combate/tarjeta-conjuro/tarjeta-conjuro'; 
import { ConjuroService } from '../../../core/services/conjuros.service';

@Component({
  selector: 'app-buscador-conjuros',
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayModule, TarjetaConjuroComponent], 
  templateUrl: './buscador-conjuros.html',
  styleUrl: './buscador-conjuros.css'
})
export class BuscadorConjurosComponent implements OnInit {
  private conjuroService = inject(ConjuroService);

  conjuros: Conjuro[] = [];
  conjurosFiltrados: Conjuro[] = [];
  
  // Controla cuál conjuro está abierto por clic
  conjuroActivo: Conjuro | null = null; 

  filtros = {
    nombre: '',
    nivel: '',
    escuela: '',
    clase: '',
    orden: 'nombre'
  };

  niveles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  escuelas = ['Abjuración', 'Adivinación', 'Conjuración', 'Encantamiento', 'Evocación', 'Ilusión', 'Nigromancia', 'Transmutación'];

  ngOnInit(): void {
    this.conjuroService.getConjuros().subscribe((data) => {
      this.conjuros = data;
      this.conjurosFiltrados = data;
    });
  }

  buscar(): void {
    this.conjurosFiltrados = this.conjuros.filter(c => {
      const matchNombre = c.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase());
      const matchNivel = this.filtros.nivel === '' || c.nivel.toString() === this.filtros.nivel;
      const matchEscuela = this.filtros.escuela === '' || c.escuela === this.filtros.escuela;
      
      return matchNombre && matchNivel && matchEscuela;
    });

    if (this.filtros.orden === 'nombre') {
      this.conjurosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.filtros.orden === 'nivel') {
      this.conjurosFiltrados.sort((a, b) => a.nivel - b.nivel);
    }
  }

  // Alterna o cambia la tarjeta seleccionada al hacer clic
  toggleTarjeta(conjuro: Conjuro) {
    if (this.conjuroActivo?.id === conjuro.id) {
      this.conjuroActivo = null; // Si vuelve a hacer clic en el mismo, se cierra
    } else {
      this.conjuroActivo = conjuro; // Si hace clic en otro, se abre/cambia
    }
  }
}