import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResenasService {
  private http = inject(HttpClient);
  private urlResenas = 'http://localhost:9999/api/resenas';

  // Método para generar las cabeceras HTTP con el token JWT del usuario autenticado.
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
  getResenasPorJuego(idVideojuego: number, idUsuario?: number): Observable<any> {
    const params = idUsuario ? `?idUsuario=${idUsuario}` : '';
    return this.http.get(`${this.urlResenas}/videojuego/${idVideojuego}${params}`, this.getHeaders());
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

  // Método para obtener las reseñas más recientes de toda la plataforma.
  getResenasRecientes(): Observable<any> {
    return this.http.get(`${this.urlResenas}/recientes`, this.getHeaders());
  }

  // Método para obtener las reseñas pendientes de revisión por el administrador.
  getResenasARevisar(): Observable<any> {
    return this.http.get(`${this.urlResenas}/aRevisar`, this.getHeaders());
  }

  // Eliminar una reseña
  eliminarResena(id: number): Observable<any> {
    return this.http.delete(`${this.urlResenas}/${id}`, this.getHeaders());
  }

  // Obtener reseña por id
  getResenaPorId(id: number): Observable<any> {
    return this.http.get(`${this.urlResenas}/${id}`, this.getHeaders());
  }

  // Votar una reseña (me gusta / no me gusta)
  votarResena(idResena: number, idUsuario: number, esMeGusta: boolean): Observable<any> {
    return this.http.post(`${this.urlResenas}/${idResena}/votar`, { idUsuario, esMeGusta }, this.getHeaders());
  }

  // Actualizar una reseña
  updateResena(idResena: number, resena: any): Observable<any> {
    return this.http.put(`${this.urlResenas}/updateResena/${idResena}`, resena, this.getHeaders());
  }
}
