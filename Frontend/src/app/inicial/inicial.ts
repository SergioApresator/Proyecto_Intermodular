import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Videojuegos } from '../videojuegos';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-inicial',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Footer],
  templateUrl: './inicial.html',
  styleUrl: './inicial.css',
})

export class Inicial implements OnInit, OnDestroy {

  //Inyecto el servicio y el detector de cambios
  constructor(private videojuegosServicio: Videojuegos, private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

  juegosDestacados: any[] = [];
  indiceCarrusel: number = 0;
  intervaloCarrusel: any = null;
  cargando: boolean = true;

  juegosAccion: any[] = [];
  juegosHorror: any[] = [];
  juegosRPG: any[] = [];
  masPopulares: any[] = [];
  proximosLanzamientos: any[] = [];

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

    this.videojuegosServicio.getJuegosDestacados().subscribe({
      next: (respuesta: any) => {
        this.juegosDestacados = respuesta.results;
        this.cargando = false;
        this.cdr.detectChanges();
        this.intervaloCarrusel = setInterval(() => {
          this.siguienteSlide();
        }, 4000);
      },
      error: (err: any) => {
        console.log('Error al cargar juegos destacados', err);
        this.cargando = false;
      }
    });

    this.videojuegosServicio.getJuegosPorGenero('action').subscribe({
      next: (respuesta: any) => {
        this.juegosAccion = respuesta.results;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar juegos de accion', err);
      }
    });

    this.videojuegosServicio.getJuegosPorGenero('horror').subscribe({
      next: (respuesta: any) => {
        this.juegosHorror = respuesta.results;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar juegos de terror', err);
      }
    });

    this.videojuegosServicio.getJuegosPorGenero('role-playing-games-rpg').subscribe({
      next: (respuesta: any) => {
        this.juegosRPG = respuesta.results;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar juegos RPG', err);
      }
    });

    this.videojuegosServicio.getMasPopulares().subscribe({
      next: (respuesta: any) => {
        this.masPopulares = respuesta.results;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar populares', err);
      }
    });

    this.videojuegosServicio.getProximosLanzamientos().subscribe({
      next: (respuesta: any) => {
        this.proximosLanzamientos = respuesta.results;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar proximos lanzamientos', err);
      }
    });
  }

  ngOnDestroy() {
    if (this.intervaloCarrusel) {
      clearInterval(this.intervaloCarrusel);
    }
  }

  siguienteSlide() {
    if (this.juegosDestacados.length > 0) {
        this.indiceCarrusel = (this.indiceCarrusel + 1) % this.juegosDestacados.length;
        //Se reinicia para no saltar pasos
        clearInterval(this.intervaloCarrusel);
        this.intervaloCarrusel = setInterval(() => {
            this.siguienteSlide();
        }, 4000);
    }
}

anteriorSlide() {
    if (this.juegosDestacados.length > 0) {
        this.indiceCarrusel = (this.indiceCarrusel - 1 + this.juegosDestacados.length) % this.juegosDestacados.length;
        //Se reinicia para no saltar pasos
        clearInterval(this.intervaloCarrusel);
        this.intervaloCarrusel = setInterval(() => {
            this.siguienteSlide();
        }, 4000);
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
}