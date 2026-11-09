import { Component, Input, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

// Servicios y Modelos
import { CriaturaService } from '../../../core/services/criatura';
import { CriaturaCompleta, Accion } from '../../../core/models/criatura';
import { Conjuro } from '../../../core/models/conjuro';

// Componentes Hijos
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
  
  // Dependencias e Inputs
  private criaturaService = inject(CriaturaService);
  @Input({ required: true }) criaturaId!: number;
  @ViewChild('fullscreenModal') modalRef?: ElementRef<HTMLDialogElement>;

  // Estado del Componente
  criatura?: CriaturaCompleta;
  cargando = true;
  error = false;
  isFullScreen = false;

  // Control de UI
  tabActualIndex = 0;
  fotoActual = 0;
  conjuroActivo: Conjuro | null = null;
  espaciosEstado: { [nivel: number]: { max: number; actuales: number } } = {};

  // ==========================================
  // CICLO DE VIDA Y CARGA DE DATOS
  // ==========================================

  ngOnInit(): void {
    this.cargarCriatura();
  }

  cargarCriatura(): void {
    this.cargando = true;
    this.criaturaService.obtenerCriaturaPorId(this.criaturaId).subscribe({
      next: (data) => {
        this.criatura = data;
        this.inicializarEspaciosConjuros();
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

  // ==========================================
  // OBTENCIÓN DE ACCIONES Y RASGOS
  // ==========================================

  get rasgos(): Accion[] { 
    return this.criatura?.acciones?.filter(a => a.tipo === 'rasgo') || []; 
  }
  
  get acciones(): Accion[] { 
    return this.criatura?.acciones?.filter(a => a.tipo === 'accion') || []; 
  }
  
  get accionesBonificadas(): Accion[] { 
    return this.criatura?.acciones?.filter(a => a.tipo === 'accion_bonificada') || []; 
  }
  
  get reacciones(): Accion[] { 
    return this.criatura?.acciones?.filter(a => a.tipo === 'reaccion') || []; 
  }
  
  get accionesLegendarias(): Accion[] { 
    return this.criatura?.acciones?.filter(a => a.tipo === 'accion_legendaria') || []; 
  }

  // ==========================================
  // GESTIÓN DE CONJUROS Y ESPACIOS
  // ==========================================

  get conjurosOrganizados(): { nivel: number; conjuros: Conjuro[] }[] {
    if (!this.criatura?.conjuros) return [];

    const conjurosOrdenados = [...this.criatura.conjuros].sort((a, b) => {
      const nivelA = a.nivel ?? 0;
      const nivelB = b.nivel ?? 0;
      if (nivelA !== nivelB) return nivelA - nivelB;
      return a.nombre.localeCompare(b.nombre);
    });

    const grupos: { [key: number]: Conjuro[] } = {};
    
    for (const conjuro of conjurosOrdenados) {
      const nivelKey = conjuro.nivel !== undefined ? Number(conjuro.nivel) : 0;
      if (!grupos[nivelKey]) {
        grupos[nivelKey] = [];
      }
      grupos[nivelKey].push(conjuro);
    }

    return Object.keys(grupos)
      .map(n => Number(n))
      .sort((a, b) => a - b)
      .map(nivel => ({
        nivel,
        conjuros: grupos[nivel]
      }));
  }

  inicializarEspaciosConjuros(): void {
    this.espaciosEstado = {};
    if (!this.criatura?.conjuros) return;

    for (const c of this.criatura.conjuros) {
      const niv = c.nivel ?? 0;
      if (c.modalidad) {
        const match = c.modalidad.match(/(\d+)\s*espacios?/i);
        if (match && !this.espaciosEstado[niv]) {
          const max = parseInt(match[1], 10);
          this.espaciosEstado[niv] = { max, actuales: max };
        }
      }
    }
  }

  formatearModalidad(modalidad?: string): string {
    if (!modalidad) return '';
    // Si dice "X espacios", ya no se muestra en el conjuro individual
    if (/espacios?/i.test(modalidad)) {
      return '';
    }
    // Limpia cualquier indicación redundante de "(Nivel X)"
    return modalidad.replace(/\s*\(?Nivel\s*\d+\)?/gi, '').trim();
  }

  usarEspacio(nivel: number): void {
    if (this.espaciosEstado[nivel] && this.espaciosEstado[nivel].actuales > 0) {
      this.espaciosEstado[nivel].actuales--;
    }
  }

  recuperarEspacio(nivel: number): void {
    if (this.espaciosEstado[nivel] && this.espaciosEstado[nivel].actuales < this.espaciosEstado[nivel].max) {
      this.espaciosEstado[nivel].actuales++;
    }
  }

  reiniciarEspacios(): void {
    for (const niv in this.espaciosEstado) {
      this.espaciosEstado[niv].actuales = this.espaciosEstado[niv].max;
    }
  }

  // ==========================================
  // NAVEGACIÓN Y PESTAÑAS (STATS, LORE, GALERÍA)
  // ==========================================

  get tabsDisponibles(): string[] {
    const tabs = ['stats'];
    if (this.criatura?.historia) tabs.push('lore');
    if (this.criatura?.imagenes_galeria && this.criatura.imagenes_galeria.length > 0) tabs.push('galeria');
    return tabs;
  }

  get tabActual(): string {
    return this.tabsDisponibles[this.tabActualIndex] || 'stats';
  }

  get nombreTabActual(): string {
    const nombres: Record<string, string> = { stats: 'Estadísticas', lore: 'Descripción', galeria: 'Galería' };
    return nombres[this.tabActual] || '';
  }

  siguienteTab(): void {
    this.tabActualIndex = (this.tabActualIndex + 1) % this.tabsDisponibles.length;
  }

  anteriorTab(): void {
    this.tabActualIndex = (this.tabActualIndex - 1 + this.tabsDisponibles.length) % this.tabsDisponibles.length;
  }

  // ==========================================
  // GALERÍA Y PANTALLA COMPLETA
  // ==========================================

  siguienteFoto(): void {
    if (!this.criatura?.imagenes_galeria) return;
    this.fotoActual = (this.fotoActual + 1) % this.criatura.imagenes_galeria.length;
  }

  anteriorFoto(): void {
    if (!this.criatura?.imagenes_galeria) return;
    this.fotoActual = (this.fotoActual - 1 + this.criatura.imagenes_galeria.length) % this.criatura.imagenes_galeria.length;
  }

  abrirPantallaCompleta(): void {
    this.isFullScreen = true;
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

  // ==========================================
  // UTILIDADES (FORMATEO)
  // ==========================================

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
}