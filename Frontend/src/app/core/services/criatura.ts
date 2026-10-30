import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CriaturaResumen, CriaturaCompleta } from '../models/criatura';

@Injectable({
  providedIn: 'root'
})
export class CriaturaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/criaturas';

  buscarCriaturas(termino: string): Observable<CriaturaResumen[]> {
    return this.http.get<CriaturaResumen[]>(`${this.apiUrl}/buscar?q=${encodeURIComponent(termino)}`);
  }

  obtenerCriaturaPorId(id: number): Observable<CriaturaCompleta> {
    return this.http.get<CriaturaCompleta>(`${this.apiUrl}/${id}`);
  }
}