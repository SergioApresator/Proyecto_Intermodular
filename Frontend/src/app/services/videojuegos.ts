import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Videojuegos {
  private http = inject(HttpClient);
  private url = 'http://localhost:9999/api/games';
  
  private tagsProhibidos = ['nudity', 'sexual-content', 'nsfw', 'erotica', 'hentai', 'adult'];

  private cache = new Map<string, any>();

  public ultimoEstadoBusqueda: any = {
    termino: '',
    filtros: {
      genero: [],
      plataforma: [],
      orden: 'relevance',
      tags: [],
      metacritic: [],
      anio: ''
    },
    juegos: [],
    bufferJuegos: [],
    paginaActual: 1,
    paginaApi: 1,
    hayPaginaSiguiente: true,
    totalPaginas: 1
  };

  private filtrarSeguro() {
    return map((res: any) => {
      let games = res.content ? res.content : (Array.isArray(res) ? res : []);
      
      games = games.filter((juego: any) => {
        if (!juego.tags) return true;
        return !juego.tags.some((t: any) => this.tagsProhibidos.includes(t.slug));
      });
      
      if (res.content) {
        res.content = games;
      } else {
        res = games;
      }
      return res;
    });
  }

  getJuegosDestacados(): Observable<any> {
    return this.http.get(`${this.url}?sort=rating,desc&size=10`).pipe(this.filtrarSeguro());
  }

  getTrendingLast30Days(): Observable<any> {
    const hoy = new Date();
    const hace90Dias = new Date();
    hace90Dias.setDate(hoy.getDate() - 90);
    const hoyStr = hoy.toISOString().split('T')[0];
    const hace90DiasStr = hace90Dias.toISOString().split('T')[0];
    return this.http.get(`${this.url}?startDate=${hace90DiasStr}&endDate=${hoyStr}&sort=added,desc&size=10`).pipe(this.filtrarSeguro());
  }

  getBestGamesOfYear(): Observable<any> {
    const anioActual = new Date().getFullYear();
    return this.http.get(`${this.url}?startDate=${anioActual}-01-01&endDate=${anioActual}-12-31&sort=rating,desc&size=10`).pipe(this.filtrarSeguro());
  }

  getMetacriticTop(): Observable<any> {
    return this.http.get(`${this.url}?sort=metacritic,desc&size=10`).pipe(this.filtrarSeguro());
  }

  getJuegosPorGenero(genero: string): Observable<any> {
    return this.http.get(`${this.url}?genres=${genero}&sort=rating,desc&size=10`).pipe(this.filtrarSeguro());
  }

  getProximosLanzamientos(): Observable<any> {
    const hoy = new Date().toISOString().split('T')[0];
    const finAnio = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
    return this.http.get(`${this.url}?startDate=${hoy}&endDate=${finAnio}&sort=added,desc&size=10`).pipe(this.filtrarSeguro());
  }

  getMasPopulares(): Observable<any> {
    return this.http.get(`${this.url}?sort=added,desc&size=10`).pipe(this.filtrarSeguro());
  }

  getJuegosPaginados(genero: string, pagina: number): Observable<any> {
    const springPage = Math.max(0, pagina - 1);
    const param = (genero === 'horror') ? 'tags' : 'genres';
    return this.http.get(`${this.url}?${param}=${genero}&sort=rating,desc&size=20&page=${springPage}`).pipe(this.filtrarSeguro());
  }

  getPopularesPaginados(pagina: number): Observable<any> {
    const springPage = Math.max(0, pagina - 1);
    return this.http.get(`${this.url}?sort=added,desc&size=20&page=${springPage}`).pipe(this.filtrarSeguro());
  }

  getProximosPaginados(pagina: number): Observable<any> {
    const springPage = Math.max(0, pagina - 1);
    const hoy = new Date().toISOString().split('T')[0];
    const finAnio = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
    return this.http.get(`${this.url}?startDate=${hoy}&endDate=${finAnio}&sort=added,desc&size=20&page=${springPage}`).pipe(this.filtrarSeguro());
  }

  buscarJuegos(termino: string, filtros: any = {}): Observable<any> {
    return this.buscarJuegosPaginados(termino, 1, filtros);
  }

  buscarJuegosPaginados(termino: string, pagina: number, filtros: any = {}): Observable<any> {
    const springPage = Math.max(0, pagina - 1);
    const cacheKey = `search-${termino}-${springPage}-${JSON.stringify(filtros)}`;
    
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    let params = new HttpParams()
        .set('size', '40')
        .set('page', springPage.toString());

    if (termino && termino.trim()) {
        params = params.set('search', termino);
    }

    let sort = 'added,desc';
    if (filtros.orden && filtros.orden !== 'relevance') {
        if (filtros.orden.startsWith('-')) {
            sort = filtros.orden.substring(1) + ',desc';
        } else {
            sort = filtros.orden + ',asc';
        }
    }
    params = params.set('sort', sort);

    // Build genre and tag params, handling 'horror' as a tag
    let genreSlugs: string[] = [];
    let tagSlugs: string[] = [];

    if (filtros.genero && Array.isArray(filtros.genero) && filtros.genero.length > 0) {
        filtros.genero.forEach((g: string) => {
            if (g === 'horror') {
                tagSlugs.push('horror');
            } else {
                genreSlugs.push(g);
            }
        });
    }

    if (filtros.tags && Array.isArray(filtros.tags) && filtros.tags.length > 0) {
        filtros.tags.forEach((t: string) => {
            if (!tagSlugs.includes(t)) tagSlugs.push(t);
        });
    }

    if (genreSlugs.length > 0) {
        params = params.set('genres', genreSlugs.join(','));
    }
    if (tagSlugs.length > 0) {
        params = params.set('tags', tagSlugs.join(','));
    }

    if (filtros.plataforma && (Array.isArray(filtros.plataforma) ? filtros.plataforma.length > 0 : filtros.plataforma)) {
        params = params.set('platforms', Array.isArray(filtros.plataforma) ? filtros.plataforma.join(',') : filtros.plataforma);
    }

    if (filtros.metacritic && (Array.isArray(filtros.metacritic) ? filtros.metacritic.length > 0 : filtros.metacritic)) {
        let minGlobal = 100;
        let maxGlobal = 0;
        let ranges = Array.isArray(filtros.metacritic) ? filtros.metacritic : [filtros.metacritic];
        ranges.forEach((range: string) => {
            const [min, max] = range.split(',').map(Number);
            if (min < minGlobal) minGlobal = min;
            if (max > maxGlobal) maxGlobal = max;
        });
        params = params.set('minMetacritic', minGlobal.toString());
        params = params.set('maxMetacritic', maxGlobal.toString());
    }

    if (filtros.anio) {
      let dates = filtros.anio.trim();
      if (/^\d{4}$/.test(dates)) {
        params = params.set('startDate', `${dates}-01-01`).set('endDate', `${dates}-12-31`);
      } else if (/^\d{4}-\d{4}$/.test(dates)) {
        const parts = dates.split('-');
        params = params.set('startDate', `${parts[0]}-01-01`).set('endDate', `${parts[1]}-12-31`);
      }
    }

    return this.http.get(this.url, { params }).pipe(
      this.filtrarSeguro(),
      tap(res => this.cache.set(cacheKey, res))
    );
  }

  getJuegoDetalles(id: string): Observable<any> {
    const cacheKey = `detail-${id}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.url}/${id}`).pipe(
      tap(res => this.cache.set(cacheKey, res))
    );
  }

  getJuegoScreenshots(id: string): Observable<any> {
    const cacheKey = `screenshots-${id}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.url}/${id}/screenshots`).pipe(
      tap(res => this.cache.set(cacheKey, res))
    );
  }

  getJuegoTrailers(id: string): Observable<any> {
    const cacheKey = `trailers-${id}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.url}/${id}/movies`).pipe(
      tap(res => this.cache.set(cacheKey, res))
    );
  }
}
