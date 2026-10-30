import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conjuro } from '../models/conjuro';

@Injectable({
  providedIn: 'root'
})
export class ConjuroService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/conjuros';

  getConjuros(): Observable<Conjuro[]> {
    return this.http.get<Conjuro[]>(this.apiUrl);
  }
}