import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AventureroService } from '../../../core/services/aventurero.service';
import { Aventurero } from '../../../core/models/aventurero';

@Component({
  selector: 'app-buscador-aventureros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador-aventureros.html',
  styleUrl: './buscador-aventureros.css'
})
export class BuscadorAventurerosComponent implements OnInit {
  private aventureroService = inject(AventureroService);

  @Output() aventureroSeleccionado = new EventEmitter<Aventurero>();

  busqueda = '';
  aventureros: Aventurero[] = [];
  resultadosFiltrados: Aventurero[] = [];
  mostrarDropdown = false;

  ngOnInit(): void {
    this.cargarAventureros();
  }

  cargarAventureros(): void {
    this.aventureroService.obtenerAventureros().subscribe({
      next: (data) => {
        this.aventureros = data;
      },
      error: (err) => console.error('Error al cargar aventureros para buscador:', err)
    });
  }

  filtrar(): void {
    const q = this.busqueda.trim().toLowerCase();
    if (!q) {
      this.resultadosFiltrados = [];
      this.mostrarDropdown = false;
      return;
    }
    this.resultadosFiltrados = this.aventureros.filter(a => 
      a.nombre.toLowerCase().includes(q) || 
      a.raza.toLowerCase().includes(q) ||
      a.clases.some(c => c.clase.toLowerCase().includes(q))
    );
    this.mostrarDropdown = true;
  }

  seleccionar(adv: Aventurero): void {
    this.aventureroSeleccionado.emit(adv);
    this.busqueda = '';
    this.mostrarDropdown = false;
  }
}
