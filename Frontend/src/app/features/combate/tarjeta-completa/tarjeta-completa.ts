import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { CriaturaService } from '../../../core/services/criatura';
import { CriaturaCompleta } from '../../../core/models/criatura';
import { Conjuro } from '../../../core/models/conjuro';
import { TarjetaConjuroComponent } from '../tarjeta-conjuro/tarjeta-conjuro';

@Component({
  selector: 'app-tarjeta-completa',
  standalone: true,
  imports: [CommonModule, OverlayModule, TarjetaConjuroComponent],
  templateUrl: './tarjeta-completa.html',
  styleUrl: './tarjeta-completa.css'
})
export class TarjetaCompletaComponent implements OnInit {
  private criaturaService = inject(CriaturaService);

  @Input({ required: true }) criaturaId!: number;

  criatura?: CriaturaCompleta;
  cargando = true;
  error = false;

  // Estado para el hover de conjuros
  conjuroActivo: Conjuro | null = null;

  ngOnInit(): void {
    this.cargarCriatura();
  }

  cargarCriatura(): void {
    this.cargando = true;
    this.criaturaService.obtenerCriaturaPorId(this.criaturaId).subscribe({
      next: (data) => {
        this.criatura = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar la criatura:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  getModificadores(valor: number): string {
    const mod = Math.floor((valor - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  formatearObjetoJson(objeto: any): string {
    if (!objeto) return '—';
    if (typeof objeto === 'string') {
      try {
        objeto = JSON.parse(objeto);
      } catch {
        return objeto;
      }
    }
    if (typeof objeto === 'object') {
      return Object.entries(objeto)
        .map(([clave, valor]) => `${clave.toUpperCase()} ${valor}`)
        .join(', ');
    }
    return String(objeto);
  }
}
