import { Component, Input, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { CriaturaResumen } from '../../../core/models/criatura';
import { TarjetaCompletaComponent } from '../tarjeta-completa/tarjeta-completa';

export interface InstanciaCombatiente {
  idInstancia: string;
  nombrePersonalizado: string;
  hpActual: number;
  hpMaximo: number;
  iniciativa: number;
  tiradaPura: number;
}

@Component({
  selector: 'app-tarjeta-basica',
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayModule, TarjetaCompletaComponent],
  templateUrl: './tarjeta-basica.html',
  styleUrl: './tarjeta-basica.css'
})
export class TarjetaBasicaComponent implements OnInit {
  private elementRef = inject(ElementRef);

  @Input({ required: true }) criatura!: CriaturaResumen;
  @Input({ required: true }) instancias: InstanciaCombatiente[] = [];

  isOpen = false;
  mostrarCalculadora = false;
  cantidadDano: number | null = null;
  tipoDano: string = 'contundente';
  esMagico: boolean = false;
  
  instanciaSeleccionada!: InstanciaCombatiente;

  private static tarjetaActiva: TarjetaBasicaComponent | null = null;

  ngOnInit(): void {
    if (this.instancias.length > 0) {
      this.instanciaSeleccionada = this.instancias[0];
    }
  }

  toggleTarjeta(event: MouseEvent): void {
    if (TarjetaBasicaComponent.tarjetaActiva && TarjetaBasicaComponent.tarjetaActiva !== this) {
      TarjetaBasicaComponent.tarjetaActiva.cerrar();
    }
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      TarjetaBasicaComponent.tarjetaActiva = this;
    } else {
      TarjetaBasicaComponent.tarjetaActiva = null;
    }
  }

  cerrar(): void {
    this.isOpen = false;
    this.mostrarCalculadora = false;
    if (TarjetaBasicaComponent.tarjetaActiva === this) {
      TarjetaBasicaComponent.tarjetaActiva = null;
    }
  }

  onOutsideClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (this.elementRef.nativeElement.contains(target)) return;
    this.cerrar();
  }

  toggleCalculadora(event: MouseEvent): void {
    event.stopPropagation();
    this.mostrarCalculadora = !this.mostrarCalculadora;
  }

  aplicarDano(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.cantidadDano || !this.instanciaSeleccionada) return;

    let danoFinal = this.cantidadDano;
    const tipo = this.tipoDano.toLowerCase();
    
    const inmunidades = (this.criatura as any).inmunidades_dano?.toLowerCase() || '';
    const resistencias = (this.criatura as any).resistencias?.toLowerCase() || '';
    const vulnerabilidades = (this.criatura as any).vulnerabilidades?.toLowerCase() || '';

    const esInmune = this.comprobarMitigacion(tipo, inmunidades, this.esMagico);
    const esResistente = this.comprobarMitigacion(tipo, resistencias, this.esMagico);
    const esVulnerable = this.comprobarMitigacion(tipo, vulnerabilidades, this.esMagico);

    if (esInmune) {
      danoFinal = 0;
    } else if (esResistente) {
      danoFinal = Math.floor(danoFinal / 2); 
    } else if (esVulnerable) {
      danoFinal = danoFinal * 2; 
    }

    this.instanciaSeleccionada.hpActual -= danoFinal;
    if (this.instanciaSeleccionada.hpActual < 0) this.instanciaSeleccionada.hpActual = 0;
    
    this.resetCalculadora();
  }

  curar(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.cantidadDano || !this.instanciaSeleccionada) return;

    this.instanciaSeleccionada.hpActual += this.cantidadDano;
    if (this.instanciaSeleccionada.hpActual > this.instanciaSeleccionada.hpMaximo) {
      this.instanciaSeleccionada.hpActual = this.instanciaSeleccionada.hpMaximo;
    }
    
    this.resetCalculadora();
  }

  private comprobarMitigacion(tipo: string, textoBaseDatos: string, ataqueMagico: boolean): boolean {
    if (!textoBaseDatos) return false;
    let textoProcesado = textoBaseDatos;

    if (ataqueMagico && ['contundente', 'cortante', 'perforante'].includes(tipo)) {
      textoProcesado = textoProcesado.replace(/contundente,?\s*cortante\s*(y|o)\s*perforante\s*de\s*ataques\s*no\s*mágicos/gi, '');
      textoProcesado = textoProcesado.replace(/de ataques no mágicos/gi, '');
    }

    return textoProcesado.includes(tipo);
  }

  private resetCalculadora(): void {
    this.cantidadDano = null;
    this.esMagico = false;
    this.mostrarCalculadora = false;
  }
}