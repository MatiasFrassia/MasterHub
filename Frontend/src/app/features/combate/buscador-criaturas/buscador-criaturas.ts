import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { CriaturaService } from '../../../core/services/criatura';
import { CriaturaResumen } from '../../../core/models/criatura';

@Component({
  selector: 'app-buscador-criaturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador-criaturas.html',
  styleUrl: './buscador-criaturas.css'
})
export class BuscadorCriaturasComponent {
  private criaturaService = inject(CriaturaService);
  private terminoBusqueda = new Subject<string>();

  @Output() criaturaSeleccionada = new EventEmitter<CriaturaResumen>();

  query = '';
  resultados: CriaturaResumen[] = [];
  cargando = false;
  mostrarResultados = false;

  constructor() {
    this.terminoBusqueda.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((termino) => {
        if (!termino.trim()) {
          this.cargando = false;
          return of([]);
        }
        this.cargando = true;
        return this.criaturaService.buscarCriaturas(termino);
      })
    ).subscribe({
      next: (data) => {
        this.resultados = data;
        this.cargando = false;
        this.mostrarResultados = true;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  onInput(): void {
    this.terminoBusqueda.next(this.query);
  }

  seleccionar(criatura: CriaturaResumen): void {
    this.criaturaSeleccionada.emit(criatura);
    this.query = '';
    this.resultados = [];
    this.mostrarResultados = false;
  }

  ocultarResultadosConDelay(): void {
    setTimeout(() => this.mostrarResultados = false, 200);
  }
}
