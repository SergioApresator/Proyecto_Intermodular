import { Injectable, inject } from '@angular/core';

//Importacione que permite llamar al backend
//permitiendo usar metodos get, post
import { HttpClient } from '@angular/common/http'; 

//Importacion que permite manejar las respuestas del servidot
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Usuarios {
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

  //Metodo para login
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.url + '/login', { email, password });
  }
}
