import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Videojuegos } from '../videojuegos';
import { ResenasService } from '../resenas';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-inicial',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Footer],
  templateUrl: './inicial.html',
  styleUrl: './inicial.css',
})

export class Inicial implements OnInit, OnDestroy {

  constructor(
    private videojuegosServicio: Videojuegos, 
    private resenasServicio: ResenasService,
    private cdr: ChangeDetectorRef, 
    private route: ActivatedRoute
  ) { }

  juegosDestacados: any[] = [];
  juegoSpotlight: any = null;
  indiceCarrusel: number = 0;
  intervaloCarrusel: any = null;
  cargando: boolean = true;

  juegosAccion: any[] = [];
  juegosHorror: any[] = [];
  juegosRPG: any[] = [];
  masPopulares: any[] = [];
  proximosLanzamientos: any[] = [];
  
  // Nuevas fuentes de datos
  juegosTendencia: any[] = [];
  mejoresDelAnio: any[] = [];
  topMetacritic: any[] = [];
  resenasRecientes: any[] = [];

  // Buscador y Filtros
  terminoBusqueda: string = '';
  filtros = {
    genero: '',
    plataforma: '',
    orden: '-added'
  };
  resultadosBusqueda: any[] = [];
  buscando: boolean = false;
  busquedaRealizada: boolean = false;

  generosDisponibles = [
    { id: '', nombre: 'Todos los géneros' },
    { id: 'action', nombre: 'Acción' },
    { id: 'adventure', nombre: 'Aventura' },
    { id: 'role-playing-games-rpg', nombre: 'RPG' },
    { id: 'shooter', nombre: 'Shooter' },
    { id: 'strategy', nombre: 'Estrategia' },
    { id: 'horror', nombre: 'Terror' }
  ];

  plataformasDisponibles = [
    { id: '', nombre: 'Todas las plataformas' },
    { id: '1', nombre: 'PC' },
    { id: '5', nombre: 'macOS' },
    { id: '2', nombre: 'PlayStation' },
    { id: '3', nombre: 'Xbox' },
    { id: '7', nombre: 'Nintendo' },
    { id: '4', nombre: 'iOS' },
    { id: '8', nombre: 'Android' }
  ];

  ordenDisponibles = [
    { id: '-added', nombre: 'Popularidad' },
    { id: 'relevance', nombre: 'Relevancia' },
    { id: '-rating', nombre: 'Puntuación' },
    { id: '-released', nombre: 'Más recientes' }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.terminoBusqueda = params['q'];
        this.buscar();
      } else {
        this.limpiarBusqueda();
      }
    });

    // Cargar datos iniciales
    this.cargarDatosPrincipales();
  }

  cargarDatosPrincipales() {
    this.cargando = true;

    // 1. Juegos Tendencia (para Spotlight)
    this.videojuegosServicio.getTrendingLast30Days().subscribe({
      next: (resp) => {
        this.juegosTendencia = resp.results;
        if (this.juegosTendencia.length > 0) {
          this.juegoSpotlight = this.juegosTendencia[0];
          // Los demás al carrusel
          this.juegosDestacados = this.juegosTendencia.slice(1, 6);
          this.iniciarCarrusel();
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    // 2. Mejores del Año
    this.videojuegosServicio.getBestGamesOfYear().subscribe({
      next: (resp) => {
        this.mejoresDelAnio = resp.results;
        this.cdr.detectChanges();
      }
    });

    // 3. Top Metacritic
    this.videojuegosServicio.getMetacriticTop().subscribe({
      next: (resp) => {
        this.topMetacritic = resp.results;
        this.cdr.detectChanges();
      }
    });

    // 4. Reseñas Recientes (Backend)
    this.resenasServicio.getResenasRecientes().subscribe({
      next: (resp) => {
        this.resenasRecientes = resp;
        this.cdr.detectChanges();
      }
    });

    // Cargar géneros y populares (mantener algunos para las secciones)
    this.videojuegosServicio.getJuegosPorGenero('action').subscribe(r => { this.juegosAccion = r.results; this.cdr.detectChanges(); });
    this.videojuegosServicio.getJuegosPorGenero('horror').subscribe(r => { this.juegosHorror = r.results; this.cdr.detectChanges(); });
    this.videojuegosServicio.getJuegosPorGenero('role-playing-games-rpg').subscribe(r => { this.juegosRPG = r.results; this.cdr.detectChanges(); });
    this.videojuegosServicio.getMasPopulares().subscribe(r => { this.masPopulares = r.results; this.cdr.detectChanges(); });
    this.videojuegosServicio.getProximosLanzamientos().subscribe(r => { this.proximosLanzamientos = r.results; this.cdr.detectChanges(); });
  }

  iniciarCarrusel() {
    if (this.intervaloCarrusel) clearInterval(this.intervaloCarrusel);
    this.intervaloCarrusel = setInterval(() => {
      this.siguienteSlide();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervaloCarrusel) {
      clearInterval(this.intervaloCarrusel);
    }
  }

  siguienteSlide() {
    if (this.juegosDestacados.length > 0) {
      this.indiceCarrusel = (this.indiceCarrusel + 1) % this.juegosDestacados.length;
      this.iniciarCarrusel();
    }
  }

  anteriorSlide() {
    if (this.juegosDestacados.length > 0) {
      this.indiceCarrusel = (this.indiceCarrusel - 1 + this.juegosDestacados.length) % this.juegosDestacados.length;
      this.iniciarCarrusel();
    }
  }

  buscar() {
    if (this.terminoBusqueda.trim().length === 0 && !this.filtros.genero && !this.filtros.plataforma) {
      this.limpiarBusqueda();
      return;
    }

    this.buscando = true;
    this.busquedaRealizada = true;
    this.videojuegosServicio.buscarJuegos(this.terminoBusqueda, this.filtros).subscribe({
      next: (respuesta: any) => {
        this.resultadosBusqueda = respuesta.results;
        this.buscando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error en la búsqueda', err);
        this.buscando = false;
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFiltrosSolo() {
    this.filtros = { genero: '', plataforma: '', orden: '-added' };
    this.buscar();
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.filtros = { genero: '', plataforma: '', orden: '-added' };
    this.resultadosBusqueda = [];
    this.busquedaRealizada = false;
    this.cdr.detectChanges();
  }

  getEstrellas(puntuacion: number): number[] {
    return Array(Math.floor(puntuacion)).fill(0);
  }
}