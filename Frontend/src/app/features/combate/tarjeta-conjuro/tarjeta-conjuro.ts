import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conjuro } from '../../../core/models/conjuro';

@Component({
  selector: 'app-tarjeta-conjuro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-conjuro.html',
  styleUrl: './tarjeta-conjuro.css'
})
export class TarjetaConjuroComponent {
  @Input({ required: true }) conjuro!: Conjuro;
}
