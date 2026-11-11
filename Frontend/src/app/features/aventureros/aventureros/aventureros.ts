import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Aventurero } from '../../../core/models/aventurero';
import { AventureroService } from '../../../core/services/aventurero.service';

@Component({
  selector: 'app-aventureros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aventureros.html',
  styleUrl: './aventureros.css'
})
export class AventurerosComponent implements OnInit {
  private aventureroService = inject(AventureroService);

  aventureros: Aventurero[] = [];
  mostrarFormulario = false;
  aventureroSeleccionado: Aventurero | null = null;
  modoEdicionModal = false;

  // Estado para el Visor de Fotos en Pantalla Completa
  isFullScreenModal = false;
  fotoActualIndex = 0;

  archivosSeleccionados: File[] = [];
  nuevoAventurero: Partial<Aventurero> = this.obtenerEstadoInicialFormulario();

  ngOnInit(): void {
    this.cargarAventureros();
  }

  cargarAventureros(): void {
    this.aventureroService.obtenerAventureros().subscribe({
      next: (data) => (this.aventureros = data),
      error: (err) => console.error('Error al cargar aventureros:', err)
    });
  }

  // ==========================================
  // MODAL DETALLE Y EDICIÓN
  // ==========================================

  abrirDetalle(adv: Aventurero): void {
    this.aventureroSeleccionado = JSON.parse(JSON.stringify(adv));
    this.modoEdicionModal = false;
  }

  cerrarModal(): void {
    this.aventureroSeleccionado = null;
    this.modoEdicionModal = false;
    this.isFullScreenModal = false;
    this.archivosSeleccionados = [];
  }

  activarModoEdicion(): void {
    this.modoEdicionModal = true;
  }

  // ==========================================
  // GESTIÓN DE GALERÍA Y PANTALLA COMPLETA
  // ==========================================

  obtenerGaleriaFotos(adv: Aventurero): string[] {
    if (adv.imagenes_galeria && adv.imagenes_galeria.length > 0) {
      return adv.imagenes_galeria;
    }
    return adv.url_imagen ? [adv.url_imagen] : [];
  }

  abrirPantallaCompleta(index: number = 0): void {
    if (!this.aventureroSeleccionado) return;
    this.fotoActualIndex = index;
    this.isFullScreenModal = true;
  }

  cerrarPantallaCompleta(): void {
    this.isFullScreenModal = false;
  }

  siguienteFoto(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!this.aventureroSeleccionado) return;
    const fotos = this.obtenerGaleriaFotos(this.aventureroSeleccionado);
    if (fotos.length === 0) return;
    this.fotoActualIndex = (this.fotoActualIndex + 1) % fotos.length;
  }

  anteriorFoto(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!this.aventureroSeleccionado) return;
    const fotos = this.obtenerGaleriaFotos(this.aventureroSeleccionado);
    if (fotos.length === 0) return;
    this.fotoActualIndex = (this.fotoActualIndex - 1 + fotos.length) % fotos.length;
  }

  eliminarImagenGaleria(index: number): void {
    if (!this.aventureroSeleccionado) return;
    const fotos = this.obtenerGaleriaFotos(this.aventureroSeleccionado);
    fotos.splice(index, 1);
    
    this.aventureroSeleccionado.imagenes_galeria = [...fotos];
    this.aventureroSeleccionado.url_imagen = fotos.length > 0 ? fotos[0] : undefined;
  }

  // ==========================================
  // FORMULARIO Y EDICIÓN
  // ==========================================

  agregarClase(targetObj: Partial<Aventurero>): void {
    if (!targetObj.clases) targetObj.clases = [];
    targetObj.clases.push({ clase: '', subclase: '', nivel: 1 });
  }

  quitarClase(targetObj: Partial<Aventurero>, index: number): void {
    if (targetObj.clases && targetObj.clases.length > 1) {
      targetObj.clases.splice(index, 1);
    }
  }

  calcularNivelTotal(clases?: any[]): number {
    return (clases || []).reduce((acc, c) => acc + (c.nivel || 1), 0);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivosSeleccionados = Array.from(input.files);
    }
  }

  guardarAventurero(): void {
    const clasesValidas = (this.nuevoAventurero.clases || []).filter(c => c.clase.trim().length > 0);
    if (!this.nuevoAventurero.nombre || !this.nuevoAventurero.raza || !this.nuevoAventurero.alineamiento || clasesValidas.length === 0) return;

    const payload: Aventurero = {
      nombre: this.nuevoAventurero.nombre.trim(),
      raza: this.nuevoAventurero.raza.trim(),
      alineamiento: this.nuevoAventurero.alineamiento.trim(),
      clases: clasesValidas.map(c => ({ clase: c.clase.trim(), subclase: c.subclase?.trim() || undefined, nivel: c.nivel || 1 })),
      url_imagen: this.nuevoAventurero.url_imagen?.trim() || undefined,
      nivel: this.calcularNivelTotal(this.nuevoAventurero.clases),
      clase_armadura: this.nuevoAventurero.clase_armadura || 10,
      hp_actual: this.nuevoAventurero.hp_maximo || 10,
      hp_maximo: this.nuevoAventurero.hp_maximo || 10,
      descripcion: this.nuevoAventurero.descripcion?.trim() || undefined
    };

    this.aventureroService.crearAventurero(payload, this.archivosSeleccionados).subscribe({
      next: () => {
        this.cargarAventureros();
        this.resetFormulario();
      },
      error: (err) => console.error('Error al guardar aventurero:', err)
    });
  }

  guardarEdicionModal(): void {
    if (!this.aventureroSeleccionado || !this.aventureroSeleccionado.id) return;

    this.aventureroService.actualizarAventurero(this.aventureroSeleccionado.id, this.aventureroSeleccionado, this.archivosSeleccionados).subscribe({
      next: () => {
        this.cargarAventureros();
        this.cerrarModal();
      },
      error: (err) => console.error('Error al actualizar aventurero:', err)
    });
  }

  eliminarAventurero(id?: number, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!id || !confirm('¿Estás seguro de eliminar este aventurero?')) return;

    this.aventureroService.eliminarAventurero(id).subscribe({
      next: () => {
        this.cargarAventureros();
        if (this.aventureroSeleccionado?.id === id) this.cerrarModal();
      },
      error: (err) => console.error('Error al eliminar aventurero:', err)
    });
  }

  modificarHP(adv: Aventurero, delta: number, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!adv.id) return;

    const nuevoHp = Math.min(Math.max(0, adv.hp_actual + delta), adv.hp_maximo);
    adv.hp_actual = nuevoHp;

    this.aventureroService.actualizarHp(adv.id, nuevoHp).subscribe({
      error: (err) => console.error('Error al actualizar HP:', err)
    });
  }

  seleccionarFotoGaleria(adv: Aventurero, url: string): void {
    adv.url_imagen = url;
  }

  private resetFormulario(): void {
    this.nuevoAventurero = this.obtenerEstadoInicialFormulario();
    this.archivosSeleccionados = [];
    this.mostrarFormulario = false;
  }

  private obtenerEstadoInicialFormulario(): Partial<Aventurero> {
    return {
      nombre: '',
      raza: '',
      alineamiento: '',
      clases: [{ clase: '', subclase: '', nivel: 1 }],
      url_imagen: '',
      nivel: 1,
      clase_armadura: 10,
      hp_actual: 10,
      hp_maximo: 10,
      descripcion: ''
    };
  }
}