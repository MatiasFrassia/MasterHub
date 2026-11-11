import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aventurero } from '../models/aventurero';

@Injectable({
  providedIn: 'root'
})
export class AventureroService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/aventureros';

  obtenerAventureros(): Observable<Aventurero[]> {
    return this.http.get<Aventurero[]>(this.apiUrl);
  }

  crearAventurero(aventurero: Aventurero, archivosImagenes?: File[]): Observable<Aventurero> {
    const formData = new FormData();
    formData.append('nombre', aventurero.nombre);
    formData.append('raza', aventurero.raza);
    formData.append('alineamiento', aventurero.alineamiento);
    formData.append('clase_armadura', aventurero.clase_armadura.toString());
    formData.append('hp_actual', aventurero.hp_actual.toString());
    formData.append('hp_maximo', aventurero.hp_maximo.toString());
    
    // Serializar array multiclase
    formData.append('clases', JSON.stringify(aventurero.clases));

    if (aventurero.descripcion) formData.append('descripcion', aventurero.descripcion);

    if (archivosImagenes && archivosImagenes.length > 0) {
      archivosImagenes.forEach(file => formData.append('imagenes', file));
    } else if (aventurero.url_imagen) {
      formData.append('url_imagen', aventurero.url_imagen);
    }

    return this.http.post<Aventurero>(this.apiUrl, formData);
  }

  actualizarHp(id: number, hpActual: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/hp`, { hp_actual: hpActual });
  }

  eliminarAventurero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarAventurero(id: number, aventurero: Aventurero, archivosImagenes?: File[]): Observable<void> {
    const formData = new FormData();
    formData.append('nombre', aventurero.nombre);
    formData.append('raza', aventurero.raza);
    formData.append('alineamiento', aventurero.alineamiento);
    formData.append('clase_armadura', aventurero.clase_armadura.toString());
    formData.append('hp_actual', aventurero.hp_actual.toString());
    formData.append('hp_maximo', aventurero.hp_maximo.toString());
    formData.append('clases', JSON.stringify(aventurero.clases));
    
    // Lista de URLs de imágenes actuales que no fueron eliminadas
    const imagenesExistentes = aventurero.imagenes_galeria || (aventurero.url_imagen ? [aventurero.url_imagen] : []);
    formData.append('imagenes_existentes', JSON.stringify(imagenesExistentes));

    if (aventurero.descripcion) formData.append('descripcion', aventurero.descripcion);

    if (archivosImagenes && archivosImagenes.length > 0) {
      archivosImagenes.forEach(file => formData.append('imagenes', file));
    }

    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }
}