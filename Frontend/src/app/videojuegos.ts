import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Videojuegos {

  private http = inject(HttpClient);
  private apiKey = '1d0e05ba2ab1447fa3f51ec4123b8b2a';
  private url = 'https://api.rawg.io/api';

  ///// PAGINA INICIAL - LISTAS HORIZONTALES /////

  //Obtiene juegos destacados para el carrusel
  getJuegosDestacados(): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&ordering=-rating&page_size=10`);
  }

  //Obtiene juegos por genero para las listas horizontales
  getJuegosPorGenero(genero: string): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&genres=${genero}&ordering=-rating&page_size=10`);
  }

  //Obtiene los proximos lanzamientos
  getProximosLanzamientos(): Observable<any> {
    const hoy = new Date().toISOString().split('T')[0];
    const finAnio = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
    return this.http.get(`${this.url}/games?key=${this.apiKey}&dates=${hoy},${finAnio}&ordering=-added&page_size=10`);
  }

  //Obtiene los juegos mas populares
  getMasPopulares(): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&ordering=-added&page_size=10`);
  }

  ///// VER TODOS /////

  //Obtiene juegos de un genero con paginacion
  getJuegosPaginados(genero: string, pagina: number): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&genres=${genero}&ordering=-rating&page_size=20&page=${pagina}`);
  }

  //Obtiene populares con paginacion
  getPopularesPaginados(pagina: number): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&ordering=-added&page_size=20&page=${pagina}`);
  }

  //Obtiene proximos lanzamientos con paginacion
  getProximosPaginados(pagina: number): Observable<any> {
    const hoy = new Date().toISOString().split('T')[0];
    const finAnio = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
    return this.http.get(`${this.url}/games?key=${this.apiKey}&dates=${hoy},${finAnio}&ordering=-added&page_size=20&page=${pagina}`);
  }

  //Busca juegos por nombre y filtros opcionales
  buscarJuegos(termino: string, filtros: any = {}): Observable<any> {
    let urlBusqueda = `${this.url}/games?key=${this.apiKey}&search=${termino}&page_size=20`;

    if (filtros.orden && filtros.orden !== 'relevance') {
      urlBusqueda += `&ordering=${filtros.orden}`;
    } else if (!filtros.orden) {
      urlBusqueda += `&ordering=-added`;
    }

    if (filtros.genero) {
      urlBusqueda += `&genres=${filtros.genero}`;
    }
    if (filtros.plataforma) {
      urlBusqueda += `&parent_platforms=${filtros.plataforma}`;
    }

    return this.http.get(urlBusqueda);
  }
}