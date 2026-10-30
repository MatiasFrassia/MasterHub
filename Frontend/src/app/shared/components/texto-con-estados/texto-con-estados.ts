import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { ESTADOS_DND, EstadoDnD } from '../../../core/constants/estados';
import { TarjetaEstadoComponent } from '../../../features/combate/tarjeta-estado/tarjeta-estado';

interface Token {
  esEstado: boolean;
  texto: string;
  estadoInfo?: EstadoDnD;
}

@Component({
  selector: 'app-texto-con-estados',
  standalone: true,
  imports: [CommonModule, OverlayModule, TarjetaEstadoComponent],
  templateUrl: './texto-con-estados.html',
  styleUrl: './texto-con-estados.css'
})
export class TextoConEstadosComponent implements OnChanges {
  @Input({ required: true }) texto: string = '';

  tokens: Token[] = [];
  estadoActivo: EstadoDnD | null = null;
  tokenActivoIndex: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['texto']) {
      this.parsearTexto();
    }
  }

  private parsearTexto(): void {
    if (!this.texto) {
      this.tokens = [];
      return;
    }

    const aliasMap = new Map<string, EstadoDnD>();
    const aliasList: string[] = [];

    Object.values(ESTADOS_DND).forEach((estado) => {
      estado.alias.forEach((alias) => {
        aliasMap.set(alias.toLowerCase(), estado);
        aliasList.push(alias);
      });
    });

    aliasList.sort((a, b) => b.length - a.length);

    const pattern = new RegExp(`\\b(${aliasList.join('|')})\\b`, 'gi');

    const result: Token[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(this.texto)) !== null) {
      const matchedWord = match[0];
      const matchIndex = match.index;

      if (matchIndex > lastIndex) {
        result.push({
          esEstado: false,
          texto: this.texto.substring(lastIndex, matchIndex)
        });
      }

      const estadoObj = aliasMap.get(matchedWord.toLowerCase());

      result.push({
        esEstado: !!estadoObj,
        texto: matchedWord,
        estadoInfo: estadoObj
      });

      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < this.texto.length) {
      result.push({
        esEstado: false,
        texto: this.texto.substring(lastIndex)
      });
    }

    this.tokens = result;
  }
}