import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { CriaturaResumen } from '../../../core/models/criatura';
import { TarjetaCompletaComponent } from '../tarjeta-completa/tarjeta-completa';

@Component({
  selector: 'app-tarjeta-basica',
  standalone: true,
  imports: [CommonModule, OverlayModule, TarjetaCompletaComponent],
  templateUrl: './tarjeta-basica.html',
  styleUrl: './tarjeta-basica.css'
})
export class TarjetaBasicaComponent {
  @Input({ required: true }) criatura!: CriaturaResumen;

  isHovered = false;
}