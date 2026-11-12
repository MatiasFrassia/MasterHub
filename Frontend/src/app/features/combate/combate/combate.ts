import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorCriaturasComponent } from '../buscador-criaturas/buscador-criaturas';
import { BuscadorAventurerosComponent } from '../buscador-aventureros/buscador-aventureros';
import { TarjetaBasicaComponent, InstanciaCombatiente } from '../tarjeta-basica/tarjeta-basica';
import { TarjetaBasicaAventureroComponent } from '../tarjeta-basica-aventurero/tarjeta-basica-aventurero';
import { CriaturaResumen } from '../../../core/models/criatura';
import { Aventurero } from '../../../core/models/aventurero';

export interface GrupoCombatiente {
  tipo: 'criatura' | 'aventurero';
  criatura?: CriaturaResumen;
  aventurero?: Aventurero;
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
  imports: [
    CommonModule, 
    BuscadorCriaturasComponent, 
    BuscadorAventurerosComponent,
    TarjetaBasicaComponent,
    TarjetaBasicaAventureroComponent
  ],
  templateUrl: './combate.html',
  styleUrl: './combate.css'
})
export class CombateComponent {
  combatientesActivos: GrupoCombatiente[] = [];

  mostrarModalResumen = false;
  bajasCombate: ResumenBaja[] = [];
  xpTotalGanada = 0;

  agregarCriaturaACombate(criatura: CriaturaResumen): void {
    const inputCantidad = prompt(`¿Cuántos "${criatura.nombre}" deseas agregar al combate?`, '1');
    if (!inputCantidad) return;

    const cantidad = parseInt(inputCantidad, 10);
    if (isNaN(cantidad) || cantidad <= 0) return;

    const hpMax = parseInt(criatura.puntos_golpe?.toString() || '0', 10);
    const instancias: InstanciaCombatiente[] = [];

    for (let i = 1; i <= cantidad; i++) {
      instancias.push({
        idInstancia: `criatura-${criatura.id}-${Date.now()}-${i}`,
        nombrePersonalizado: `${criatura.nombre} #${i}`,
        hpActual: hpMax,
        hpMaximo: hpMax,
        iniciativa: 0,
        tiradaPura: 0
      });
    }

    this.combatientesActivos.push({
      tipo: 'criatura',
      criatura,
      instancias
    });
  }

  agregarAventureroACombate(adv: Aventurero): void {
    const instancia: InstanciaCombatiente = {
      idInstancia: `adv-${adv.id}-${Date.now()}`,
      nombrePersonalizado: adv.nombre,
      hpActual: adv.hp_actual,
      hpMaximo: adv.hp_maximo,
      iniciativa: 0,
      tiradaPura: 0
    };

    this.combatientesActivos.push({
      tipo: 'aventurero',
      aventurero: adv,
      instancias: [instancia]
    });
  }

  eliminarGrupo(grupo: GrupoCombatiente): void {
    this.combatientesActivos = this.combatientesActivos.filter(g => g !== grupo);
  }

  tirarIniciativaGlobal(): void {
    for (const grupo of this.combatientesActivos) {
      // Solo tiramos dados automáticos para las criaturas
      if (grupo.tipo === 'criatura' && grupo.criatura) {
        const des = (grupo.criatura as any).destreza ?? 10;
        const modDes = Math.floor((des - 10) / 2);

        const tiradaD20 = Math.floor(Math.random() * 20) + 1;
        let iniciativaTotal = tiradaD20 + modDes;

        if (tiradaD20 === 20) iniciativaTotal = 999;
        else if (tiradaD20 === 1) iniciativaTotal = -999;

        for (const inst of grupo.instancias) {
          inst.iniciativa = iniciativaTotal;
          inst.tiradaPura = tiradaD20;
        }
      }
    }

    this.ordenarPorIniciativa();
  }

  ordenarPorIniciativa(): void {
    this.combatientesActivos.sort((a, b) => {
      const iniA = a.instancias[0]?.iniciativa ?? 0;
      const iniB = b.instancias[0]?.iniciativa ?? 0;
      return iniB - iniA;
    });
  }

  cerrarCombate(): void {
    this.bajasCombate = [];
    this.xpTotalGanada = 0;

    for (const grupo of this.combatientesActivos) {
      if (grupo.tipo === 'criatura' && grupo.criatura) {
        const derrotados = grupo.instancias.filter(i => i.hpActual === 0).length;

        if (derrotados > 0) {
          const xpUnidad = grupo.criatura.puntos_experiencia ?? 0;
          const xpGrupo = derrotados * xpUnidad;

          this.bajasCombate.push({
            nombre: grupo.criatura.nombre,
            cantidadDerrotados: derrotados,
            xpUnidad,
            xpTotalGrupo: xpGrupo
          });

          this.xpTotalGanada += xpGrupo;
        }
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