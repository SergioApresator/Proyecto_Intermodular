import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  private http = inject(HttpClient);
  private urlRespuestas = 'http://localhost:9999/api/respuestas';

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

  // Método para obtener todas las respuestas asociadas a una reseña concreta.
  getRespuestasPorResena(idResena: number, idUsuario?: number): Observable<any> {
    const params = idUsuario ? `?idUsuario=${idUsuario}` : '';
    return this.http.get(`${this.urlRespuestas}/resena/${idResena}${params}`, this.getHeaders());
  }

  // Método para registrar el voto (me gusta o no me gusta) del usuario sobre una respuesta.
  votarRespuesta(idRespuesta: number, idUsuario: number, esMeGusta: boolean): Observable<any> {
    return this.http.post(`${this.urlRespuestas}/${idRespuesta}/votar`, { idUsuario, esMeGusta }, this.getHeaders());
  }

  // Método para publicar una respuesta a una reseña, con soporte para respuestas anidadas.
  crearRespuesta(idResena: number, idUsuario: number, mensaje: string, idRespuestaPadre?: number): Observable<any> {
    const payload = {
      mensaje: mensaje,
      id_resena: idResena,
      id_usuario: idUsuario,
      id_respuesta_padre: idRespuestaPadre || null,
      meGustas: 0,
      noMeGustas: 0
    };
    return this.http.post(this.urlRespuestas, payload, this.getHeaders());
  }

  // Método para eliminar una respuesta por su ID.
  eliminarRespuesta(id: number): Observable<any> {
    return this.http.delete(`${this.urlRespuestas}/${id}`, this.getHeaders());
  }
}
