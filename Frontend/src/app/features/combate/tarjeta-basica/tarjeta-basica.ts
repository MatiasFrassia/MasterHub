import { Component, Input, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { CriaturaResumen } from '../../../core/models/criatura';
import { TarjetaCompletaComponent } from '../tarjeta-completa/tarjeta-completa';

@Component({
  selector: 'app-tarjeta-basica',
  standalone: true,
  imports: [CommonModule, OverlayModule, TarjetaCompletaComponent],
  templateUrl: './tarjeta-basica.html',
  styleUrl: './tarjeta-basica.css'
})
export class TarjetaBasicaComponent {
  private elementRef = inject(ElementRef);

  @Input({ required: true }) criatura!: CriaturaResumen;

  isOpen = false;

  // Guarda la instancia de la tarjeta que está actualmente desplegada
  private static tarjetaActiva: TarjetaBasicaComponent | null = null;

  toggleTarjeta(event: MouseEvent): void {
    // Si hay otra tarjeta desplegada, la cerramos inmediatamente
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
    if (TarjetaBasicaComponent.tarjetaActiva === this) {
      TarjetaBasicaComponent.tarjetaActiva = null;
    }
  }

  onOutsideClick(event: MouseEvent): void {
    const target = event.target as Node;
    
    // Si el clic ocurrió dentro de la propia tarjeta básica (trigger), 
    // ignoramos el evento externo para que toggleTarjeta() maneje el cierre sin duplicar llamadas.
    if (this.elementRef.nativeElement.contains(target)) {
      return;
    }

    this.cerrar();
  }
}