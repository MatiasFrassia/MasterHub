import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { ObjetoMagico } from '../../../core/models/objeto-magico';
import { CriaturaResumen } from '../../../core/models/criatura';
import { Aventurero } from '../../../core/models/aventurero';
import { Conjuro } from '../../../core/models/conjuro';
import { ObjetosMagicosService } from '../../../core/services/objetos-magicos.service';
import { BuscadorCriaturasComponent } from '../buscador-criaturas/buscador-criaturas';
import { BuscadorAventurerosComponent } from '../buscador-aventureros/buscador-aventureros';
import { TarjetaConjuroComponent } from '../tarjeta-conjuro/tarjeta-conjuro';

@Component({
  selector: 'app-tarjeta-completa-objeto',
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule,
    BuscadorCriaturasComponent,
    BuscadorAventurerosComponent,
    TarjetaConjuroComponent
  ],
  templateUrl: './tarjeta-completa-objeto.html',
  styleUrl: './tarjeta-completa-objeto.css'
})
export class TarjetaCompletaObjetoComponent implements OnInit {
  private objetosService = inject(ObjetosMagicosService);

  @Input({ required: true }) objeto!: ObjetoMagico;
  @Output() vinculacionCambiada = new EventEmitter<string | undefined>();

  cargando = false;
  conjuroActivo: Conjuro | null = null;

  ngOnInit(): void {
    // Asegurar que cargas_actuales esté inicializado
    if (this.objeto.cargas_maximas && this.objeto.cargas_actuales === undefined) {
      this.objeto.cargas_actuales = this.objeto.cargas_maximas;
    }

    // Si aún no cargamos las habilidades/conjuros desde BD para esta instancia, los traemos
    if (!this.objeto.habilidades || !this.objeto.conjuros) {
      this.cargando = true;
      this.objetosService.getObjetoMagicoPorId(this.objeto.id).subscribe({
        next: (detalle) => {
          this.objeto.habilidades = detalle.habilidades || [];
          this.objeto.conjuros = detalle.conjuros || [];
          if (detalle.cargas_maximas && this.objeto.cargas_actuales === undefined) {
            this.objeto.cargas_maximas = detalle.cargas_maximas;
            this.objeto.cargas_actuales = detalle.cargas_maximas;
          }
          this.objeto.recuperacion_cargas = detalle.recuperacion_cargas;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar detalle del objeto mágico:', err);
          this.cargando = false;
        }
      });
    }
  }

  // ==========================================
  // GESTIÓN DE CARGAS
  // ==========================================

  get cargasActuales(): number {
    return this.objeto.cargas_actuales ?? 0;
  }

  puedeGastar(coste: number): boolean {
    return this.cargasActuales >= coste;
  }

  gastarCargas(cantidad: number): void {
    if (!this.objeto.cargas_maximas) return;
    if (this.cargasActuales >= cantidad) {
      this.objeto.cargas_actuales = this.cargasActuales - cantidad;
    }
  }

  recuperarCarga(): void {
    if (!this.objeto.cargas_maximas) return;
    if (this.cargasActuales < this.objeto.cargas_maximas) {
      this.objeto.cargas_actuales = this.cargasActuales + 1;
    }
  }

  reiniciarCargas(): void {
    if (!this.objeto.cargas_maximas) return;
    this.objeto.cargas_actuales = this.objeto.cargas_maximas;
  }

  // ==========================================
  // VINCULACIÓN DE PORTADOR
  // ==========================================

  vincularCriatura(criatura: CriaturaResumen): void {
    this.objeto.vinculadoA = criatura.nombre;
    this.vinculacionCambiada.emit(criatura.nombre);
  }

  vincularAventurero(aventurero: Aventurero): void {
    this.objeto.vinculadoA = aventurero.nombre;
    this.vinculacionCambiada.emit(aventurero.nombre);
  }

  desvincular(): void {
    this.objeto.vinculadoA = undefined;
    this.vinculacionCambiada.emit(undefined);
  }
}
