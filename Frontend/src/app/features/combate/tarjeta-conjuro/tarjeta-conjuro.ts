import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conjuro } from '../../../core/models/conjuro';
import { TextoConEstadosComponent } from '../../../shared/components/texto-con-estados/texto-con-estados';

@Component({
  selector: 'app-tarjeta-conjuro',
  standalone: true,
  imports: [
    CommonModule, 
    TextoConEstadosComponent // Importamos el componente para usarlo en el HTML
  ],
  templateUrl: './tarjeta-conjuro.html',
  styleUrl: './tarjeta-conjuro.css'
})
export class TarjetaConjuroComponent {
  @Input({ required: true }) conjuro!: Conjuro;
}
