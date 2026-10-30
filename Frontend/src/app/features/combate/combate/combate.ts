import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorCriaturasComponent } from '../buscador-criaturas/buscador-criaturas';
import { TarjetaBasicaComponent } from '../tarjeta-basica/tarjeta-basica';
import { CriaturaResumen } from '../../../core/models/criatura';


@Component({
  selector: 'app-combate',
  standalone: true,
  imports: [CommonModule, BuscadorCriaturasComponent, TarjetaBasicaComponent],
  templateUrl: './combate.html',
  styleUrl: './combate.css'
})
export class CombateComponent {
  combatientesActivos: CriaturaResumen[] = [];

  agregarACombate(criatura: CriaturaResumen): void {
    this.combatientesActivos.push(criatura);
  }
}
