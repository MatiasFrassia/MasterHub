import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Aventurero } from '../../../core/models/aventurero';

@Component({
  selector: 'app-tarjeta-completa-aventurero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-completa-aventurero.html',
  styleUrl: './tarjeta-completa-aventurero.css'
})
export class TarjetaCompletaAventureroComponent {
  @Input({ required: true }) aventurero!: Aventurero;
  @ViewChild('fullscreenModal') modalRef?: ElementRef<HTMLDialogElement>;

  tabActualIndex = 0;
  fotoActual = 0;
  isFullScreen = false;

  get fotosGaleria(): string[] {
    if (this.aventurero?.imagenes_galeria && this.aventurero.imagenes_galeria.length > 0) {
      return this.aventurero.imagenes_galeria;
    }
    return this.aventurero?.url_imagen ? [this.aventurero.url_imagen] : [];
  }

  get tabsDisponibles(): string[] {
    const tabs = ['stats'];
    if (this.fotosGaleria.length > 0) tabs.push('galeria');
    return tabs;
  }

  get tabActual(): string {
    return this.tabsDisponibles[this.tabActualIndex] || 'stats';
  }

  get nombreTabActual(): string {
    const nombres: Record<string, string> = { stats: 'Estadísticas', galeria: 'Galería' };
    return nombres[this.tabActual] || '';
  }

  siguienteTab(): void {
    this.tabActualIndex = (this.tabActualIndex + 1) % this.tabsDisponibles.length;
  }

  anteriorTab(): void {
    this.tabActualIndex = (this.tabActualIndex - 1 + this.tabsDisponibles.length) % this.tabsDisponibles.length;
  }

  siguienteFoto(): void {
    if (this.fotosGaleria.length === 0) return;
    this.fotoActual = (this.fotoActual + 1) % this.fotosGaleria.length;
  }

  anteriorFoto(): void {
    if (this.fotosGaleria.length === 0) return;
    this.fotoActual = (this.fotoActual - 1 + this.fotosGaleria.length) % this.fotosGaleria.length;
  }

  abrirPantallaCompleta(): void {
    this.isFullScreen = true;
    setTimeout(() => { this.modalRef?.nativeElement.showModal(); }, 0);
  }

  cerrarPantallaCompleta(): void {
    this.modalRef?.nativeElement.close();
    this.isFullScreen = false;
  }

  navFullScreen(event: Event, direccion: 'prev' | 'next'): void {
    event.stopPropagation();
    if (direccion === 'prev') this.anteriorFoto();
    else this.siguienteFoto();
  }
}