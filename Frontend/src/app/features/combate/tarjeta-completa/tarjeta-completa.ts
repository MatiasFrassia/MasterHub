import { Component, Input, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { CriaturaService } from '../../../core/services/criatura';
import { CriaturaCompleta, Accion } from '../../../core/models/criatura';
import { Conjuro } from '../../../core/models/conjuro';
import { TarjetaConjuroComponent } from '../tarjeta-conjuro/tarjeta-conjuro';
import { TextoConEstadosComponent } from '../../../shared/components/texto-con-estados/texto-con-estados';


@Component({
  selector: 'app-tarjeta-completa',
  standalone: true,
  imports: [
    CommonModule, 
    OverlayModule, 
    TarjetaConjuroComponent, 
    TextoConEstadosComponent
  ],
  templateUrl: './tarjeta-completa.html',
  styleUrl: './tarjeta-completa.css'
})
export class TarjetaCompletaComponent implements OnInit {
  private criaturaService = inject(CriaturaService);

  @Input({ required: true }) criaturaId!: number;

  criatura?: CriaturaCompleta;
  cargando = true;
  error = false;
  conjuroActivo: Conjuro | null = null;
  @ViewChild('fullscreenModal') modalRef?: ElementRef<HTMLDialogElement>;
  isFullScreen = false;

  // Control de pestañas y galería
  tabActualIndex = 0;
  fotoActual = 0;

  ngOnInit(): void {
    this.cargarCriatura();
  }

  cargarCriatura(): void {
    this.cargando = true;
    this.criaturaService.obtenerCriaturaPorId(this.criaturaId).subscribe({
      next: (data) => {
        this.criatura = data;
        this.cargando = false;
        this.tabActualIndex = 0;
        this.fotoActual = 0;
      },
      error: (err) => {
        console.error('Error al cargar la criatura:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  // --- Lógica de Pestañas ---
  get tabsDisponibles(): string[] {
    const tabs = ['stats'];
    if (this.criatura?.historia) tabs.push('lore');
    if (this.criatura?.imagenes_galeria && this.criatura.imagenes_galeria.length > 0) tabs.push('galeria');
    return tabs;
  }

  get tabActual(): string {
    return this.tabsDisponibles[this.tabActualIndex] || 'stats';
  }

  siguienteTab(): void {
    this.tabActualIndex = (this.tabActualIndex + 1) % this.tabsDisponibles.length;
  }

  anteriorTab(): void {
    this.tabActualIndex = (this.tabActualIndex - 1 + this.tabsDisponibles.length) % this.tabsDisponibles.length;
  }

  get nombreTabActual(): string {
    const nombres: Record<string, string> = { stats: 'Estadísticas', lore: 'Descripción', galeria: 'Galería' };
    return nombres[this.tabActual] || '';
  }

  // --- Lógica del Slider de Galería ---
  siguienteFoto(): void {
    if (!this.criatura?.imagenes_galeria) return;
    this.fotoActual = (this.fotoActual + 1) % this.criatura.imagenes_galeria.length;
  }

  anteriorFoto(): void {
    if (!this.criatura?.imagenes_galeria) return;
    this.fotoActual = (this.fotoActual - 1 + this.criatura.imagenes_galeria.length) % this.criatura.imagenes_galeria.length;
  }

  // --- Lógica original de Acciones y Stats ---
  get rasgos(): Accion[] { return this.criatura?.acciones?.filter(a => a.tipo === 'rasgo') || []; }
  get acciones(): Accion[] { return this.criatura?.acciones?.filter(a => a.tipo === 'accion') || []; }
  get accionesBonificadas(): Accion[] { return this.criatura?.acciones?.filter(a => a.tipo === 'accion_bonificada') || []; }
  get reacciones(): Accion[] { return this.criatura?.acciones?.filter(a => a.tipo === 'reaccion') || []; }
  get accionesLegendarias(): Accion[] { return this.criatura?.acciones?.filter(a => a.tipo === 'accion_legendaria') || []; }

  getModificadores(valor: number): string {
    const mod = Math.floor((valor - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  formatearObjetoJson(objeto: any): string {
    if (!objeto) return '—';
    if (typeof objeto === 'string') {
      try { objeto = JSON.parse(objeto); } catch { return objeto; }
    }
    if (typeof objeto === 'object') {
      return Object.entries(objeto).map(([k, v]) => `${k.toUpperCase()} ${v}`).join(', ');
    }
    return String(objeto);
  }

  abrirPantallaCompleta(): void {
    this.isFullScreen = true;
    // El setTimeout le da tiempo a Angular de renderizar el HTML antes de abrir el modal nativo
    setTimeout(() => {
      if (this.modalRef?.nativeElement) {
        this.modalRef.nativeElement.showModal();
      }
    }, 0);
  }

  cerrarPantallaCompleta(): void {
    if (this.modalRef?.nativeElement) {
      this.modalRef.nativeElement.close();
    }
    this.isFullScreen = false;
  }

  navFullScreen(event: Event, direccion: 'prev' | 'next'): void {
    event.stopPropagation();
    if (direccion === 'prev') {
      this.anteriorFoto();
    } else {
      this.siguienteFoto();
    }
  }
}