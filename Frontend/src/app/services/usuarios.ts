import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Usuarios {

  // Subject reactivo para notificar la actualización del perfil (foto y banner)
  // Permite que componentes lejanos (ej. Navbar) refresquen la vista al momento
  private perfilActualizadoSource = new Subject<void>();
  perfilActualizado$ = this.perfilActualizadoSource.asObservable();

  notificarCambioPerfil() {
    this.perfilActualizadoSource.next();
  }

  // Inyección de HttpClient para la comunicación directa con nuestra API
  private http = inject(HttpClient);
  private url = 'http://localhost:9999/api/usuarios';

  // Guarda/Registra un nuevo usuario en la base de datos
  guardarUsuario(datos: any): Observable<any> {
    return this.http.post(this.url, datos);
  }

  // Login unificado: admite tanto 'email' como 'username' en el campo identifier
  login(identifier: string, password: string): Observable<any> {
    return this.http.post(this.url + '/login', { identifier, password });
  }

  // Método para iniciar sesión usando el nombre de usuario como identificador.
  loginUsername(username: string, password: string): Observable<any> {
    return this.login(username, password);
  }

  // Método para iniciar sesión usando el correo electrónico como identificador.
  loginEmail(email: string, password: string): Observable<any> {
    return this.login(email, password);
  }

  // Método para obtener los datos completos de un usuario por su ID.
  getUsuarioById(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`, this.getHeaders());
  }

  // Buscador de usuarios general (filtros de administración o búsqueda en feed)
  buscarUsuarios(query: string): Observable<any> {
    return this.http.get(`${this.url}/buscar?query=${query}`);
  }

  // Método para actualizar los datos del perfil de un usuario.
  actualizarUsuario(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, datos, this.getHeaders());
  }

  // Sube la foto de perfil del usuario.
  subirFotoPerfil(id: number, file: File): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.url}/${id}/foto`, formData, {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      })
    });
  }

  // Elimina la foto de perfil en el backend (poniendo su url a null)
  resetearFotoPerfil(id: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return this.http.delete(`${this.url}/${id}/foto`, {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      })
    });
  }

  // Sube la portada/banner de perfil
  subirBanner(id: number, file: File): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.url}/${id}/banner`, formData, {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      })
    });
  }

  // Resetea la portada de perfil
  resetearBanner(id: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return this.http.delete(`${this.url}/${id}/banner`, {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      })
    });
  }

  // --- MÓDULO DE LISTAS Y FAVORITOS ---
  private urlListas = 'http://localhost:9999/api/listas';

  // Helper para generar las cabeceras comunes de autenticación JWT
  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  // Recupera listas personalizadas de un usuario (ej. Jugados, Pendientes, Favoritos)
  getListasUsuario(usuarioId: number): Observable<any> {
    return this.http.get(`${this.urlListas}/usuario/${usuarioId}`, this.getHeaders());
  }

  // Método para añadir un videojuego a una lista del usuario.
  agregarALista(datos: any): Observable<any> {
    return this.http.post(this.urlListas, datos, this.getHeaders());
  }

  // Método para eliminar un videojuego de una lista del usuario.
  eliminarDeLista(listaId: number): Observable<any> {
    return this.http.delete(`${this.urlListas}/${listaId}`, this.getHeaders());
  }
}
