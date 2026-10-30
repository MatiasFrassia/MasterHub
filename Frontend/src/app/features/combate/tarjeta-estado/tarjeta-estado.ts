import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoDnD } from '../../../core/constants/estados';

@Component({
  selector: 'app-tarjeta-estado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-estado.html',
  styleUrl: './tarjeta-estado.css'
})
export class TarjetaEstadoComponent {
  @Input({ required: true }) estado!: EstadoDnD;
}