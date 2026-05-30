import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Notificacion {

  private http = inject(HttpClient);
  private url = 'http://localhost:9999/api/notificaciones';

  // Helper para generar cabeceras con el token JWT
  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  // Obtiene las notificaciones de un usuario
  getNotificaciones(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/usuario/${usuarioId}`, this.getHeaders());
  }

  // Obtiene el recuento de no leídas
  getNoLeidasCount(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/usuario/${usuarioId}/no-leidas-count`, this.getHeaders());
  }

  // Marca una notificación como leída
  marcarComoLeida(id: number): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}/leer`, {}, this.getHeaders());
  }

  // Marca todas como leídas
  marcarTodasComoLeidas(usuarioId: number): Observable<void> {
    return this.http.put<void>(`${this.url}/usuario/${usuarioId}/leer-todas`, {}, this.getHeaders());
  }

  // Elimina una notificación
  eliminarNotificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, this.getHeaders());
  }
}
