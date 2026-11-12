import { Component, Input, Output, EventEmitter, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { Aventurero } from '../../../core/models/aventurero';
import { InstanciaCombatiente } from '../tarjeta-basica/tarjeta-basica';
import { TarjetaCompletaAventureroComponent } from '../tarjeta-completa-aventurero/tarjeta-completa-aventurero';

@Component({
  selector: 'app-tarjeta-basica-aventurero',
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayModule, TarjetaCompletaAventureroComponent],
  templateUrl: './tarjeta-basica-aventurero.html',
  styleUrl: './tarjeta-basica-aventurero.css'
})
export class TarjetaBasicaAventureroComponent {
  private elementRef = inject(ElementRef);

  @Input({ required: true }) aventurero!: Aventurero;
  @Input({ required: true }) instancia!: InstanciaCombatiente;

  @Output() iniciativaCambiada = new EventEmitter<void>();
  @Output() retirarCombatiente = new EventEmitter<void>();

  isOpen = false;
  mostrarCalculadora = false;
  cantidadDano: number | null = null;

  private static tarjetaActiva: TarjetaBasicaAventureroComponent | null = null;

  onIniciativaInput(): void {
    this.iniciativaCambiada.emit();
  }

  retirar(event: MouseEvent): void {
    event.stopPropagation();
    this.retirarCombatiente.emit();
  }

  toggleTarjeta(event: MouseEvent): void {
    if (TarjetaBasicaAventureroComponent.tarjetaActiva && TarjetaBasicaAventureroComponent.tarjetaActiva !== this) {
      TarjetaBasicaAventureroComponent.tarjetaActiva.cerrar();
    }
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      TarjetaBasicaAventureroComponent.tarjetaActiva = this;
    } else {
      TarjetaBasicaAventureroComponent.tarjetaActiva = null;
    }
  }

  cerrar(): void {
    this.isOpen = false;
    this.mostrarCalculadora = false;
    if (TarjetaBasicaAventureroComponent.tarjetaActiva === this) {
      TarjetaBasicaAventureroComponent.tarjetaActiva = null;
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
    if (!this.cantidadDano) return;
    this.instancia.hpActual = Math.max(0, this.instancia.hpActual - this.cantidadDano);
    this.cantidadDano = null;
    this.mostrarCalculadora = false;
  }

  curar(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.cantidadDano) return;
    this.instancia.hpActual = Math.min(this.instancia.hpMaximo, this.instancia.hpActual + this.cantidadDano);
    this.cantidadDano = null;
    this.mostrarCalculadora = false;
  }
}
