import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class Videojuegos {

  private http = inject(HttpClient);
  private apiKey = '1d0e05ba2ab1447fa3f51ec4123b8b2a';
  private url = 'https://api.rawg.io/api';
  
  // Lista de tags prohibidos para el filtro de seguridad
  private tagsProhibidos = ['nudity', 'sexual-content', 'nsfw', 'erotica', 'hentai', 'adult'];


  
  // Cache para evitar peticiones redundantes
  private cache = new Map<string, any>();

  // Almacenar el último estado para persistencia entre navegaciones
  public ultimoEstadoBusqueda: any = {
    termino: '',
    filtros: {
      genero: '',
      plataforma: '',
      orden: 'relevance',
      tags: '',
      metacritic: '',
      anio: ''
    },
    juegos: [],
    paginaActual: 1,
    hayMas: true
  };

  // Helper para filtrar juegos no deseados de cualquier respuesta de la API
  private filtrarSeguro() {
    return map((res: any) => {
      if (res && res.results) {
        res.results = res.results.filter((juego: any) => {
          if (!juego.tags) return true;
          return !juego.tags.some((t: any) => this.tagsProhibidos.includes(t.slug));
        });
      }
      return res;
    });
  }


  ///// PAGINA INICIAL - LISTAS HORIZONTALES /////

  //Obtiene juegos destacados para el carrusel (Top Rated All Time)
  getJuegosDestacados(): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&ordering=-rating&page_size=10`).pipe(this.filtrarSeguro());
  }



  // NUEVO: Obtiene juegos en tendencia (lanzados en los últimos 30 días con más actividad)
  getTrendingLast30Days(): Observable<any> {
    const hoy = new Date();
    const hace90Dias = new Date();
    hace90Dias.setDate(hoy.getDate() - 90);
    
    const hoyStr = hoy.toISOString().split('T')[0];
    const hace90DiasStr = hace90Dias.toISOString().split('T')[0];
    
    return this.http.get(`${this.url}/games?key=${this.apiKey}&dates=${hace90DiasStr},${hoyStr}&ordering=-added&page_size=10`).pipe(this.filtrarSeguro());


  }


  // NUEVO: Mejores juegos del año actual
  getBestGamesOfYear(): Observable<any> {
    const anioActual = new Date().getFullYear();
    return this.http.get(`${this.url}/games?key=${this.apiKey}&dates=${anioActual}-01-01,${anioActual}-12-31&ordering=-rating&page_size=10`).pipe(this.filtrarSeguro());


  }

  // NUEVO: Top Metacritic
  getMetacriticTop(): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&ordering=-metacritic&page_size=10`).pipe(this.filtrarSeguro());


  }

  //Obtiene juegos por genero para las listas horizontales
  getJuegosPorGenero(genero: string): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&genres=${genero}&ordering=-rating&page_size=10`).pipe(this.filtrarSeguro());


  }

  //Obtiene los proximos lanzamientos
  getProximosLanzamientos(): Observable<any> {
    const hoy = new Date().toISOString().split('T')[0];
    const finAnio = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
    return this.http.get(`${this.url}/games?key=${this.apiKey}&dates=${hoy},${finAnio}&ordering=-added&page_size=10`).pipe(this.filtrarSeguro());


  }

  //Obtiene los juegos mas populares
  getMasPopulares(): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&ordering=-added&page_size=10`).pipe(this.filtrarSeguro());


  }

  ///// VER TODOS /////

  getJuegosPaginados(genero: string, pagina: number): Observable<any> {
    const param = (genero === 'horror') ? 'tags' : 'genres';
    return this.http.get(`${this.url}/games?key=${this.apiKey}&${param}=${genero}&ordering=-rating&page_size=20&page=${pagina}`).pipe(this.filtrarSeguro());
  }




  //Obtiene populares con paginacion
  getPopularesPaginados(pagina: number): Observable<any> {
    return this.http.get(`${this.url}/games?key=${this.apiKey}&ordering=-added&page_size=20&page=${pagina}`).pipe(this.filtrarSeguro());


  }

  //Obtiene proximos lanzamientos con paginacion
  getProximosPaginados(pagina: number): Observable<any> {
    const hoy = new Date().toISOString().split('T')[0];
    const finAnio = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
    return this.http.get(`${this.url}/games?key=${this.apiKey}&dates=${hoy},${finAnio}&ordering=-added&page_size=20&page=${pagina}`).pipe(this.filtrarSeguro());


  }

  //Busca juegos por nombre y filtros opcionales
  buscarJuegos(termino: string, filtros: any = {}): Observable<any> {
    return this.buscarJuegosPaginados(termino, 1, filtros);
  }

  // NUEVO: Busca juegos con paginación
  buscarJuegosPaginados(termino: string, pagina: number, filtros: any = {}): Observable<any> {
    const cacheKey = `search-${termino}-${pagina}-${JSON.stringify(filtros)}`;
    
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    // search_precise=true desactiva el fuzzy matching, haciendo la búsqueda más rápida en el servidor de RAWG
    let urlBusqueda = `${this.url}/games?key=${this.apiKey}&page_size=40&page=${pagina}`;




    if (termino && termino.trim()) {
      urlBusqueda += `&search=${termino}&search_precise=true`;
    }

    if (filtros.orden && filtros.orden !== 'relevance') {
      urlBusqueda += `&ordering=${filtros.orden}`;
    } else if (!filtros.orden || (filtros.orden === 'relevance' && !termino)) {
      // Si no hay término, la relevancia no existe, usamos -added por defecto
      urlBusqueda += `&ordering=-added`;
    }



    let genresToPass = [];
    let tagsToPass = [];

    if (Array.isArray(filtros.genero)) {
      filtros.genero.forEach((g: string) => {
        if (g === 'horror') tagsToPass.push('horror');
        else genresToPass.push(g);
      });
    } else if (filtros.genero) {
      if (filtros.genero === 'horror') tagsToPass.push('horror');
      else genresToPass.push(filtros.genero);
    }

    if (Array.isArray(filtros.tags)) {
      tagsToPass.push(...filtros.tags);
    } else if (filtros.tags) {
      tagsToPass.push(filtros.tags);
    }

    if (genresToPass.length > 0) {
      urlBusqueda += `&genres=${genresToPass.join(',')}`;
    }
    if (tagsToPass.length > 0) {
      urlBusqueda += `&tags=${tagsToPass.join(',')}`;
    }

    if (Array.isArray(filtros.plataforma) && filtros.plataforma.length > 0) {
      urlBusqueda += `&parent_platforms=${filtros.plataforma.join(',')}`;
    } else if (typeof filtros.plataforma === 'string' && filtros.plataforma) {
      urlBusqueda += `&parent_platforms=${filtros.plataforma}`;
    }

    if (Array.isArray(filtros.metacritic) && filtros.metacritic.length > 0) {
      // Calculamos el rango min y max global para pedir a la API
      let minGlobal = 100;
      let maxGlobal = 0;
      filtros.metacritic.forEach((range: string) => {
        const [min, max] = range.split(',').map(Number);
        if (min < minGlobal) minGlobal = min;
        if (max > maxGlobal) maxGlobal = max;
      });
      urlBusqueda += `&metacritic=${minGlobal},${maxGlobal}`;
    } else if (typeof filtros.metacritic === 'string' && filtros.metacritic) {
      urlBusqueda += `&metacritic=${filtros.metacritic}`;
    }



    if (filtros.anio) {
      let dates = filtros.anio.trim();
      // Si el usuario pone solo un año (ej: 2024)
      if (/^\d{4}$/.test(dates)) {
        dates = `${dates}-01-01,${dates}-12-31`;
      } 
      // Si el usuario pone un rango (ej: 2010-2020)
      else if (/^\d{4}-\d{4}$/.test(dates)) {
        const parts = dates.split('-');
        dates = `${parts[0]}-01-01,${parts[1]}-12-31`;
      }
      urlBusqueda += `&dates=${dates}`;
    }

    return this.http.get(urlBusqueda).pipe(
      this.filtrarSeguro(),
      tap(res => this.cache.set(cacheKey, res))
    );

  }

  ///// DETALLES DEL JUEGO /////

  //Obtiene detalles completos de un juego
  getJuegoDetalles(id: string): Observable<any> {
    const cacheKey = `detail-${id}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.url}/games/${id}?key=${this.apiKey}&language=es`).pipe(
      tap(res => this.cache.set(cacheKey, res))
    );
  }

  //Obtiene capturas de pantalla de un juego
  getJuegoScreenshots(id: string): Observable<any> {
    const cacheKey = `screenshots-${id}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.url}/games/${id}/screenshots?key=${this.apiKey}`).pipe(
      tap(res => this.cache.set(cacheKey, res))
    );
  }

  //Obtiene trailers/videos de un juego
  getJuegoTrailers(id: string): Observable<any> {
    const cacheKey = `trailers-${id}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.url}/games/${id}/movies?key=${this.apiKey}`).pipe(
      tap(res => this.cache.set(cacheKey, res))
    );
  }
}