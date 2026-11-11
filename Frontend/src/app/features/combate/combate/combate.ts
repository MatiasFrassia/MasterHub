import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorCriaturasComponent } from '../buscador-criaturas/buscador-criaturas';
import { TarjetaBasicaComponent, InstanciaCombatiente } from '../tarjeta-basica/tarjeta-basica';
import { CriaturaResumen } from '../../../core/models/criatura';

export interface GrupoCombatiente {
  criatura: CriaturaResumen;
  instancias: InstanciaCombatiente[];
}

export interface ResumenBaja {
  nombre: string;
  cantidadDerrotados: number;
  xpUnidad: number;
  xpTotalGrupo: number;
}

@Component({
  selector: 'app-combate',
  standalone: true,
  imports: [CommonModule, BuscadorCriaturasComponent, TarjetaBasicaComponent],
  templateUrl: './combate.html',
  styleUrl: './combate.css'
})
export class CombateComponent {
  combatientesActivos: GrupoCombatiente[] = [];

  // Variables para el modal de fin de combate
  mostrarModalResumen = false;
  bajasCombate: ResumenBaja[] = [];
  xpTotalGanada = 0;

  agregarACombate(criatura: CriaturaResumen): void {
    const inputCantidad = prompt(`¿Cuántos "${criatura.nombre}" deseas agregar al combate?`, '1');
    if (!inputCantidad) return;

    const cantidad = parseInt(inputCantidad, 10);
    if (isNaN(cantidad) || cantidad <= 0) return;

    const hpMax = parseInt(criatura.puntos_golpe?.toString() || '0', 10);
    const instancias: InstanciaCombatiente[] = [];

    for (let i = 1; i <= cantidad; i++) {
      instancias.push({
        idInstancia: `${criatura.id}-${Date.now()}-${i}`,
        nombrePersonalizado: `${criatura.nombre} #${i}`,
        hpActual: hpMax,
        hpMaximo: hpMax,
        iniciativa: 0,
        tiradaPura: 0
      });
    }

    this.combatientesActivos.push({
      criatura,
      instancias
    });
  }

  eliminarGrupo(grupo: GrupoCombatiente): void {
    this.combatientesActivos = this.combatientesActivos.filter(g => g !== grupo);
  }

  tirarIniciativaGlobal(): void {
    for (const grupo of this.combatientesActivos) {
      const des = (grupo.criatura as any).destreza ?? 10;
      const modDes = Math.floor((des - 10) / 2);

      const tiradaD20 = Math.floor(Math.random() * 20) + 1;
      let iniciativaTotal = tiradaD20 + modDes;

      if (tiradaD20 === 20) {
        iniciativaTotal = 999;
      } else if (tiradaD20 === 1) {
        iniciativaTotal = -999;
      }

      for (const inst of grupo.instancias) {
        inst.iniciativa = iniciativaTotal;
        inst.tiradaPura = tiradaD20;
      }
    }

    this.ordenarPorIniciativa();
  }

  ordenarPorIniciativa(): void {
    this.combatientesActivos.sort((a, b) => {
      const iniA = a.instancias[0]?.iniciativa ?? 0;
      const iniB = b.instancias[0]?.iniciativa ?? 0;

      if (iniB !== iniA) {
        return iniB - iniA;
      }

      const modDesA = Math.floor((((a.criatura as any).destreza ?? 10) - 10) / 2);
      const modDesB = Math.floor((((b.criatura as any).destreza ?? 10) - 10) / 2);
      return modDesB - modDesA;
    });
  }

  // Calcula las criaturas con 0 HP y abre el popup
  cerrarCombate(): void {
    this.bajasCombate = [];
    this.xpTotalGanada = 0;

    for (const grupo of this.combatientesActivos) {
      // Contamos solo las instancias con 0 de vida
      const derrotados = grupo.instancias.filter(i => i.hpActual === 0).length;

      if (derrotados > 0) {
        const xpUnidad = grupo.criatura.puntos_experiencia ?? 0;
        const xpGrupo = derrotados * xpUnidad;

        this.bajasCombate.push({
          nombre: grupo.criatura.nombre,
          cantidadDerrotados: derrotados,
          xpUnidad: xpUnidad,
          xpTotalGrupo: xpGrupo
        });

        this.xpTotalGanada += xpGrupo;
      }
    }

    this.mostrarModalResumen = true;
  }

  confirmarFinCombate(): void {
    this.combatientesActivos = [];
    this.mostrarModalResumen = false;
  }

  cancelarFinCombate(): void {
    this.mostrarModalResumen = false;
  }
}