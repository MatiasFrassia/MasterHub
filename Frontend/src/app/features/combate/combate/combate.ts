import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorCriaturasComponent } from '../buscador-criaturas/buscador-criaturas';
import { TarjetaBasicaComponent, InstanciaCombatiente } from '../tarjeta-basica/tarjeta-basica';
import { CriaturaResumen } from '../../../core/models/criatura';

export interface GrupoCombatiente {
  criatura: CriaturaResumen;
  instancias: InstanciaCombatiente[];
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

  agregarACombate(criatura: CriaturaResumen): void {
    const inputCantidad = prompt(`¿Cuántos "${criatura.nombre}" deseas agregar al combate?`, '1');
    if (!inputCantidad) return;

    const cantidad = parseInt(inputCantidad, 10);
    if (isNaN(cantidad) || cantidad <= 0) return;

    const hpMax = parseInt(criatura.puntos_golpe?.toString() || '0', 10);
    const des = (criatura as any).destreza ?? 10;
    const modDes = Math.floor((des - 10) / 2);

    // LANZAMOS EL D20 PURAMENTE
    const tiradaD20 = Math.floor(Math.random() * 20) + 1;
    let iniciativaTotal = tiradaD20 + modDes;

    // REGLAS ESPECIALES DE D&D PARA EL D20 NATURAL
    if (tiradaD20 === 20) {
      iniciativaTotal = 999; // Se asegura ir primero absoluto
    } else if (tiradaD20 === 1) {
      iniciativaTotal = -999; // Se asegura ir último absoluto
    }

    console.log(`[Iniciativa Grupo: ${criatura.nombre}] Des: ${des} (Mod: ${modDes}) | Tirada d20: ${tiradaD20} | Total Iniciativa: ${iniciativaTotal} | Cantidad: ${cantidad}`);

    const instancias: InstanciaCombatiente[] = [];

    for (let i = 1; i <= cantidad; i++) {
      instancias.push({
        idInstancia: `${criatura.id}-${Date.now()}-${i}`,
        nombrePersonalizado: `${criatura.nombre} #${i}`,
        hpActual: hpMax,
        hpMaximo: hpMax,
        iniciativa: iniciativaTotal,
        tiradaPura: tiradaD20 // <-- Guardamos la tirada para los estilos
      });
    }

    this.combatientesActivos.push({
      criatura,
      instancias
    });
  }
}