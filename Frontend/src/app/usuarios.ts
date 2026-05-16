import { Injectable, inject } from '@angular/core';

//Importacione que permite llamar al backend
//permitiendo usar metodos get, post
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

//Importacion que permite manejar las respuestas del servidot
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Usuarios {
  // Subject para notificar cambios en el perfil (como la foto) a otros componentes (navbar)
  private perfilActualizadoSource = new Subject<void>();
  perfilActualizado$ = this.perfilActualizadoSource.asObservable();

  notificarCambioPerfil() {
    this.perfilActualizadoSource.next();
  }
  //Se inyecta HttpClient para comunicar con backend
  //al inyectarse no hay que comfigurarla, se hace solo
  private http = inject(HttpClient);
  private url = 'http://localhost:9999/api/usuarios';

  //Función para enviar el formulario al backend
  //se pone 'text' as 'json' para que no de fallos al frecibir la respuesta del servidor,
  //ya que algunos serfvidores devuelven un mensaje en vez de un objeto
  guardarUsuario(datos: any): Observable<any> {
    return this.http.post(this.url, datos);
  }

  //Metodos para login
  login(identifier: string, password: string): Observable<any> {
    return this.http.post(this.url + '/login', { identifier, password });
  }

  loginUsername(username: string, password: string): Observable<any> {
    return this.login(username, password);
  }
  
  loginEmail(email: string, password: string): Observable<any> {
    return this.login(email, password);
  }

  // Obtener usuario por ID
  getUsuarioById(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`, this.getHeaders());
  }

  // Buscar usuarios por username, nombre o apellidos
  buscarUsuarios(query: string): Observable<any> {
    return this.http.get(`${this.url}/buscar?query=${query}`);
  }

  // Actualizar usuario
  actualizarUsuario(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, datos, this.getHeaders());
  }

  // Subir foto de perfil (multipart)
  subirFotoPerfil(id: number, file: File): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    formData.append('file', file);
    // No incluir 'Content-Type' manualmente — el navegador lo pone con el boundary correcto
    return this.http.post(`${this.url}/${id}/foto`, formData, {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      })
    });
  }

  resetearFotoPerfil(id: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return this.http.delete(`${this.url}/${id}/foto`, {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      })
    });
  }

  // Subir banner de perfil (multipart)
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

  // --- LISTAS Y FAVORITOS ---
  private urlListas = 'http://localhost:9999/api/listas';

  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  getListasUsuario(usuarioId: number): Observable<any> {
    return this.http.get(`${this.urlListas}/usuario/${usuarioId}`, this.getHeaders());
  }

  agregarALista(datos: any): Observable<any> {
    return this.http.post(this.urlListas, datos, this.getHeaders());
  }

  eliminarDeLista(listaId: number): Observable<any> {
    return this.http.delete(`${this.urlListas}/${listaId}`, this.getHeaders());
  }
  
}
