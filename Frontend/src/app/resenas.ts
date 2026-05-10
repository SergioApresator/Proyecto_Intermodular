import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResenasService {
  private http = inject(HttpClient);
  private urlResenas = 'http://localhost:9999/api/resenas';

  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  // Obtener reseñas por videojuego
  getResenasPorJuego(idVideojuego: number): Observable<any> {
    return this.http.get(`${this.urlResenas}/videojuego/${idVideojuego}`, this.getHeaders());
  }

  // Obtener reseñas por usuario
  getResenasPorUsuario(idUsuario: number): Observable<any> {
    return this.http.get(`${this.urlResenas}/usuario/${idUsuario}`, this.getHeaders());
  }

  // Crear una nueva reseña
  crearResena(resena: any): Observable<any> {
    return this.http.post(this.urlResenas, resena, this.getHeaders());
  }

  // Obtener respuestas por usuario
  getRespuestasPorUsuario(idUsuario: number): Observable<any> {
    return this.http.get(`http://localhost:9999/api/respuestas/usuario/${idUsuario}`, this.getHeaders());
  }

  // Obtener reseña por id
  getResenaPorId(id: number): Observable<any> {
    return this.http.get(`${this.urlResenas}/${id}`, this.getHeaders());
  }

  // Votar una reseña (me gusta / no me gusta)
  votarResena(idResena: number, idUsuario: number, esMeGusta: boolean): Observable<any> {
    return this.http.post(`${this.urlResenas}/${idResena}/votar`, { idUsuario, esMeGusta }, this.getHeaders());
  }

  // Obtener reseñas recientes de toda la comunidad
  getResenasRecientes(): Observable<any> {
    return this.http.get(`${this.urlResenas}/recientes`, this.getHeaders());
  }
}
