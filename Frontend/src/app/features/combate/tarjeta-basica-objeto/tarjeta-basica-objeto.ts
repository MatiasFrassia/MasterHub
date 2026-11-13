import { Component, Input, Output, EventEmitter, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { ObjetoMagico } from '../../../core/models/objeto-magico';
import { TarjetaCompletaObjetoComponent } from '../tarjeta-completa-objeto/tarjeta-completa-objeto';

@Component({
  selector: 'app-tarjeta-basica-objeto',
  standalone: true,
  imports: [CommonModule, OverlayModule, TarjetaCompletaObjetoComponent],
  templateUrl: './tarjeta-basica-objeto.html',
  styleUrl: './tarjeta-basica-objeto.css'
})
export class TarjetaBasicaObjetoComponent {
  private elementRef = inject(ElementRef);

  @Input({ required: true }) objeto!: ObjetoMagico;
  @Output() retirarObjeto = new EventEmitter<void>();

  isOpen = false;
  private static tarjetaActiva: TarjetaBasicaObjetoComponent | null = null;

  toggleTarjeta(event: MouseEvent): void {
    event.stopPropagation();
    if (TarjetaBasicaObjetoComponent.tarjetaActiva && TarjetaBasicaObjetoComponent.tarjetaActiva !== this) {
      TarjetaBasicaObjetoComponent.tarjetaActiva.cerrar();
    }
    this.isOpen = !this.isOpen;
    TarjetaBasicaObjetoComponent.tarjetaActiva = this.isOpen ? this : null;
  }

  cerrar(): void {
    this.isOpen = false;
    if (TarjetaBasicaObjetoComponent.tarjetaActiva === this) {
      TarjetaBasicaObjetoComponent.tarjetaActiva = null;
    }
  }

  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.elementRef.nativeElement.contains(target)) return;
    if (target.closest('.cdk-overlay-pane')) return;
    this.cerrar();
  }

  retirar(event: MouseEvent): void {
    event.stopPropagation();
    this.cerrar();
    this.retirarObjeto.emit();
  }
}
