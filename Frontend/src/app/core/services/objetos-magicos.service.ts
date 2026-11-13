import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjetoMagico } from '../models/objeto-magico';

@Injectable({
  providedIn: 'root'
})
export class ObjetosMagicosService {
  private apiUrl = 'http://localhost:3000/api/objetos-magicos';

  constructor(private http: HttpClient) { }

  getObjetosMagicos(): Observable<ObjetoMagico[]> {
    return this.http.get<ObjetoMagico[]>(this.apiUrl);
  }

  getObjetoMagicoPorId(id: number): Observable<ObjetoMagico> {
    return this.http.get<ObjetoMagico>(`${this.apiUrl}/${id}`);
  }
}
