import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Videojuegos } from '../videojuegos';
import { FormsModule } from '@angular/forms';

import { Footer } from '../footer/footer';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Footer],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class Busqueda implements OnInit {
  private route = inject(ActivatedRoute);
  private videojuegosServicio = inject(Videojuegos);
  private cdr = inject(ChangeDetectorRef);

  juegos: any[] = [];
  cargando: boolean = true;
  termino: string = '';
  paginaActual: number = 1;
  hayPaginaSiguiente: boolean = true;




  // Filtros
  filtros: any = {
    genero: '',
    plataforma: '',
    orden: 'relevance',
    tags: '',
    metacritic: '',
    anio: ''
  };

  generosDisponibles = [
    { id: '', nombre: 'Todos los géneros' },
    { id: '4', nombre: 'Acción' },
    { id: '51', nombre: 'Indie' },
    { id: '3', nombre: 'Aventura' },
    { id: '5', nombre: 'RPG' },
    { id: '10', nombre: 'Estrategia' },
    { id: '2', nombre: 'Shooter' },
    { id: '1', nombre: 'Carreras' },
    { id: '15', nombre: 'Deportes' },
    { id: '14', nombre: 'Simulación' },
    { id: '7', nombre: 'Puzzle' },
  ];

  plataformasDisponibles = [
    { id: '', nombre: 'Todas las plataformas' },
    { id: '1', nombre: 'PC' },
    { id: '2', nombre: 'PlayStation' },
    { id: '3', nombre: 'Xbox' },
    { id: '7', nombre: 'Nintendo' },
    { id: '4', nombre: 'iOS' },
    { id: '8', nombre: 'Android' },
  ];

  tagsDisponibles = [
    { id: '', nombre: 'Todas las etiquetas' },
    { id: '31', nombre: 'Singleplayer' },
    { id: '7', nombre: 'Multiplayer' },
    { id: '18', nombre: 'Co-op' },
    { id: '36', nombre: 'Open World' },
    { id: '149', nombre: 'Third Person' },
    { id: '118', nombre: 'Story Rich' },
    { id: '411', nombre: 'Cooperative' },
  ];

  metacriticDisponibles = [
    { id: '', nombre: 'Cualquier nota' },
    { id: '90,100', nombre: '90-100 (Imprescindibles)' },
    { id: '80,89', nombre: '80-89 (Muy buenos)' },
    { id: '70,79', nombre: '70-79 (Buenos)' },
    { id: '50,69', nombre: '50-69 (Regulares)' },
  ];

  ordenDisponibles = [
    { id: 'relevance', nombre: 'Relevancia' },
    { id: '-added', nombre: 'Más recientes' },
    { id: '-rating', nombre: 'Mejor valorados' },
    { id: '-metacritic', nombre: 'Metacritic' },
    { id: 'released', nombre: 'Fecha lanzamiento' },
    { id: 'name', nombre: 'Nombre (A-Z)' },
  ];

  dropdownsAbiertos: any = {
    genero: false,
    plataforma: false,
    anio: false,
    tags: false,
    metacritic: false,
    orden: false
  };

  errorAnio: boolean = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const queryTerm = params['q'];
      
      // Si hay parámetros en la URL, es una búsqueda nueva o desde navbar
      if (queryTerm !== undefined) {
        this.termino = queryTerm || '';
        this.limpiarFiltros(); // Esto reseteará el estado del servicio también
      } 
      // Si no hay parámetros en la URL, intentamos restaurar el último estado guardado
      else if (this.videojuegosServicio.ultimoEstadoBusqueda.juegos.length > 0) {
        this.restaurarEstado();
      }
      // Si no hay nada, búsqueda limpia
      else {
        this.reiniciarBusqueda();
      }
    });
  }

  restaurarEstado() {
    const estado = this.videojuegosServicio.ultimoEstadoBusqueda;
    this.termino = estado.termino;
    this.filtros = { ...estado.filtros };
    this.juegos = [...estado.juegos];
    this.paginaActual = estado.paginaActual;
    this.hayPaginaSiguiente = estado.hayPaginaSiguiente;
    this.cargando = false;
    this.cdr.detectChanges();
  }

  guardarEstado() {
    this.videojuegosServicio.ultimoEstadoBusqueda = {

      termino: this.termino,
      filtros: { ...this.filtros },
      juegos: [...this.juegos],
      paginaActual: this.paginaActual,
      hayPaginaSiguiente: this.hayPaginaSiguiente
    };
  }


  toggleDropdown(nombre: string, event: Event) {
    event.stopPropagation();
    // Cerrar los demás
    for (let key in this.dropdownsAbiertos) {
      if (key !== nombre) this.dropdownsAbiertos[key] = false;
    }
    this.dropdownsAbiertos[nombre] = !this.dropdownsAbiertos[nombre];
  }

  @HostListener('document:click')
  cerrarDropdowns() {
    for (let key in this.dropdownsAbiertos) {
      this.dropdownsAbiertos[key] = false;
    }
  }

  seleccionarFiltro(campo: string, valor: any) {
    this.filtros[campo] = valor;
    this.reiniciarBusqueda();
  }

  getNombreFiltro(campo: string, lista: any[]): string {
    const item = lista.find(i => i.id === this.filtros[campo]);
    return item ? item.nombre : 'Seleccionar';
  }

  reiniciarBusqueda() {
    this.juegos = [];
    this.paginaActual = 1;
    this.hayPaginaSiguiente = true;
    this.cargando = true;
    this.ejecutarBusqueda();
  }


  ejecutarBusqueda() {
    this.cargando = true;
    this.cdr.detectChanges();
    this.videojuegosServicio.buscarJuegosPaginados(this.termino, this.paginaActual, this.filtros).subscribe({
      next: (respuesta: any) => {
        this.juegos = respuesta.results;
        this.hayPaginaSiguiente = respuesta.next !== null;
        this.cargando = false;
        this.guardarEstado();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error en búsqueda:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }


  validarAnio(): boolean {
    const dates = this.filtros.anio.trim();
    if (!dates) {
      this.errorAnio = false;
      return true;
    }

    const regexSingle = /^\d{4}$/;
    const regexRange = /^\d{4}-\d{4}$/;

    if (regexSingle.test(dates) || regexRange.test(dates)) {
      this.errorAnio = false;
      return true;
    } else {
      this.errorAnio = true;
      return false;
    }
  }

  aplicarFiltros() {
    if (this.validarAnio()) {
      this.reiniciarBusqueda();
    }
  }

  limpiarFiltros() {
    this.filtros = {
      genero: '',
      plataforma: '',
      orden: 'relevance',
      tags: '',
      metacritic: '',
      anio: ''
    };
    this.errorAnio = false;
    this.reiniciarBusqueda();
    this.guardarEstado(); // Guardar el estado limpio
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.ejecutarBusqueda();
      window.scrollTo(0, 0);
    }
  }

  paginaSiguiente() {
    if (this.hayPaginaSiguiente) {
      this.paginaActual++;
      this.ejecutarBusqueda();
      window.scrollTo(0, 0);
    }
  }
}

