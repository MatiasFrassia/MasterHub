import { Component, Input, OnInit, inject } from '@angular/core';
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

  ngOnInit(): void {
    this.cargarCriatura();
  }

  cargarCriatura(): void {
  this.cargando = true;
  this.criaturaService.obtenerCriaturaPorId(this.criaturaId).subscribe({
    next: (data) => {
      console.log('Datos de la criatura cargada:', data); // 👈 Verifica si data.acciones tiene elementos
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
