import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ObjetoMagico } from '../../../core/models/objeto-magico';
import { ObjetosMagicosService } from '../../../core/services/objetos-magicos.service';

@Component({
  selector: 'app-objetos-magicos',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- AGREGA ESTOS DOS AQUÍ
  templateUrl: './objetos-magicos.component.html',
  styleUrl: './objetos-magicos.component.css'
})
export class ObjetosMagicosComponent implements OnInit {
  objetos: ObjetoMagico[] = [];
  objetosFiltrados: ObjetoMagico[] = [];
  objetoSeleccionado: ObjetoMagico | null = null;

  // Variables para filtros
  filtroNombre: string = '';
  filtroRareza: string = '';
  filtroTipo: string = '';
  criterioOrden: string = 'nombre'; // Por defecto ordenamos por nombre

  // Opciones para los selects
  rarezas: string[] = ['Común', 'Poco común', 'Raro', 'Muy raro', 'Legendario', 'Artefacto'];
  tipos: string[] = ['Arma', 'Armadura', 'Anillo', 'Varita', 'Bastón', 'Poción', 'Pergamino', 'Objeto maravilloso'];

  constructor(private objetosMagicosService: ObjetosMagicosService) {}

  ngOnInit(): void {
    this.obtenerObjetos();
  }

  obtenerObjetos() {
    this.objetosMagicosService.getObjetosMagicos().subscribe({
      next: (data) => {
        // Orden alfabético inicial por nombre
        this.objetos = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.objetosFiltrados = [...this.objetos];
      },
      error: (error) => console.error('Error al obtener objetos mágicos:', error)
    });
  }

  aplicarFiltros() {
    this.objetosFiltrados = this.objetos.filter(obj => {
      const cumpleNombre = obj.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const cumpleRareza = this.filtroRareza ? obj.rareza === this.filtroRareza : true;
      const cumpleTipo = this.filtroTipo ? obj.tipo === this.filtroTipo : true;
      return cumpleNombre && cumpleRareza && cumpleTipo;
    });
    this.ordenarLista();
  }

  ordenarLista() {
    this.objetosFiltrados.sort((a, b) => {
      const valorA = (a as any)[this.criterioOrden] || '';
      const valorB = (b as any)[this.criterioOrden] || '';
      return valorA.localeCompare(valorB);
    });
  }

  seleccionarObjeto(objeto: ObjetoMagico) {
    // Si se hace clic en el mismo objeto, se cierra la tarjeta, sino se abre
    this.objetoSeleccionado = this.objetoSeleccionado?.id === objeto.id ? null : objeto;
  }

  cerrarTarjeta() {
    this.objetoSeleccionado = null;
  }
}
