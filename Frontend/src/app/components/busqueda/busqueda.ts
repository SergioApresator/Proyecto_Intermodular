import { Component, OnInit, inject, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Videojuegos } from '../../services/videojuegos';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


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
  paginaActual: number = 1; // Página VIRTUAL (la que ve el usuario)
  paginaApi: number = 1;    // Página REAL de la API RAWG
  bufferJuegos: any[] = []; // Juegos que ya pasaron el filtro pero no se han mostrado
  hayPaginaSiguiente: boolean = true;
  intentosExtra: number = 0;
  totalPaginas: number = 1;

  private searchSubscription?: Subscription;
  private searchSubject = new Subject<void>();







  // Filtros
  filtros: any = {
    genero: [],
    plataforma: [],
    orden: 'relevance',
    tags: [],
    metacritic: [],
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
    { id: 'horror', nombre: 'Terror' },
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
    { id: '-released', nombre: 'Más recientes' },

    { id: '-rating', nombre: 'Mejor valorados' },
    { id: '-metacritic', nombre: 'Metacritic' },
    { id: 'released', nombre: 'Más antiguos' },

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

  // Método para inicializar el componente, configurar el debounce y restaurar el estado previo si existe.
  ngOnInit() {
    // Configurar debounce para la búsqueda
    this.searchSubject.pipe(
      debounceTime(400)
    ).subscribe(() => {
      this.reiniciarBusqueda();
    });

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

  // Método para limpiar las suscripciones activas al destruir el componente.
  ngOnDestroy() {
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
    this.searchSubject.complete();
  }


  // Método para persistir el estado actual de búsqueda en el servicio para restaurarlo al volver.
  guardarEstado() {
    this.videojuegosServicio.ultimoEstadoBusqueda = {
      termino: this.termino,
      filtros: { ...this.filtros },
      juegos: [...this.juegos],
      bufferJuegos: [...this.bufferJuegos],
      paginaActual: this.paginaActual,
      paginaApi: this.paginaApi,
      hayPaginaSiguiente: this.hayPaginaSiguiente,
      totalPaginas: this.totalPaginas
    };
  }

  // Método para recuperar el estado previo de búsqueda guardado en el servicio.
  restaurarEstado() {
    const estado = this.videojuegosServicio.ultimoEstadoBusqueda;
    this.termino = estado.termino;
    this.filtros = { ...estado.filtros };
    this.juegos = [...estado.juegos];
    this.bufferJuegos = [...(estado.bufferJuegos || [])];
    this.paginaActual = estado.paginaActual;
    this.paginaApi = estado.paginaApi || estado.paginaActual;
    this.hayPaginaSiguiente = estado.hayPaginaSiguiente;
    this.totalPaginas = estado.totalPaginas || 1;
    this.cargando = false;
    this.cdr.detectChanges();
  }



  // Método para abrir o cerrar el dropdown de filtros seleccionado, cerrando los demás.
  toggleDropdown(nombre: string, event: Event) {
    event.stopPropagation();
    // Cerrar los demás
    for (let key in this.dropdownsAbiertos) {
      if (key !== nombre) this.dropdownsAbiertos[key] = false;
    }
    this.dropdownsAbiertos[nombre] = !this.dropdownsAbiertos[nombre];
  }

  @HostListener('document:click')
  // Método para cerrar todos los dropdowns de filtros al hacer clic fuera de ellos.
  cerrarDropdowns() {
    for (let key in this.dropdownsAbiertos) {
      this.dropdownsAbiertos[key] = false;
    }
  }

  // Método para activar o desactivar un valor de filtro y lanzar una nueva búsqueda.
  seleccionarFiltro(campo: string, valor: any) {
    if (campo === 'orden' || campo === 'anio') {
      this.filtros[campo] = valor;
    } else {
      if (valor === '') {
        this.filtros[campo] = [];
      } else {
        const index = this.filtros[campo].indexOf(valor);
        if (index > -1) {
          this.filtros[campo].splice(index, 1);
        } else {
          this.filtros[campo].push(valor);
        }
      }
    }
    this.reiniciarBusqueda();
  }

  // Método para comprobar si un valor de filtro está actualmente seleccionado.
  esSeleccionado(campo: string, valor: any): boolean {
    if (campo === 'orden' || campo === 'anio') {
      return this.filtros[campo] === valor;
    }
    if (valor === '') return this.filtros[campo].length === 0;
    return this.filtros[campo].indexOf(valor) > -1;
  }

  // Método para obtener el texto a mostrar en el botón del filtro según las opciones seleccionadas.
  getNombreFiltro(campo: string, lista: any[]): string {
    if (campo === 'orden' || campo === 'anio') {
      const item = lista.find(i => i.id === this.filtros[campo]);
      // Si es relevancia, no mostramos el indicador de orden
      return item ? item.nombre : 'Seleccionar';
    } else {

      const seleccionados = this.filtros[campo];
      if (seleccionados.length === 0) return lista[0].nombre;
      if (seleccionados.length === 1) {
        const item = lista.find(i => i.id === seleccionados[0]);
        return item ? item.nombre : 'Seleccionar';
      }
      return `${seleccionados.length} SELECCIONADOS`;
    }
  }


  // Método para resetear el estado de paginación y lanzar una búsqueda desde el principio.
  reiniciarBusqueda() {
    // Cancelar cualquier búsqueda en curso
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    this.juegos = [];
    this.bufferJuegos = [];
    this.paginaActual = 1;
    this.paginaApi = 1;
    this.hayPaginaSiguiente = true;
    this.totalPaginas = 1;
    this.cargando = true;
    this.intentosExtra = 0; // Resetear intentos extra
    this.ejecutarBusqueda();
  }








  // Método para ejecutar la búsqueda con paginación usando un buffer interno para garantizar 20 resultados por página.
  ejecutarBusqueda() {
    this.cargando = true;
    this.cdr.detectChanges();

    // 1. Si ya tenemos suficientes juegos en el buffer para completar una página de 20
    if (this.bufferJuegos.length >= 20) {
      this.juegos = this.bufferJuegos.splice(0, 20);
      this.finalizarBusqueda();
      return;
    }

    // 2. Si no, necesitamos pedir más a la API
    this.searchSubscription = this.videojuegosServicio.buscarJuegosPaginados(this.termino, this.paginaApi, this.filtros).subscribe({
      next: (respuesta: any) => {

        const rawResults = respuesta.results || [];
        
        // Filtrar con lógica AND (Intersección) + Metacritic (OR)
        const filtrados = rawResults.filter((juego: any) => this.cumpleFiltros(juego));


        // Añadir los nuevos juegos filtrados al buffer
        this.bufferJuegos = [...this.bufferJuegos, ...filtrados];
        this.hayPaginaSiguiente = respuesta.next !== null;
        this.paginaApi++;

        if (respuesta.count) {
          this.totalPaginas = Math.ceil(respuesta.count / 20);
        }

        // 3. ¿Tenemos ya 20 para mostrar? 
        // O ¿se acabaron las páginas de la API?
        // O ¿hemos hecho ya demasiados intentos (evitar bucle infinito)?
        if (this.bufferJuegos.length < 20 && this.hayPaginaSiguiente && this.intentosExtra < 8) {
          this.intentosExtra++;
          this.ejecutarBusqueda(); // Llamada recursiva interna
        } else {
          // Tomamos los primeros 20 (o los que haya) para mostrar
          this.juegos = this.bufferJuegos.splice(0, 20);
          this.finalizarBusqueda();
        }
      },
      error: (err: any) => {
        console.error('Error en búsqueda:', err);
        this.finalizarBusqueda();
      }
    });
  }

  private finalizarBusqueda() {
    this.intentosExtra = 0;
    this.cargando = false;
    this.guardarEstado();
    this.cdr.detectChanges();
  }

  // Método para validar que el filtro de año tiene formato correcto (año simple o rango).
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

  // Método para aplicar los filtros actuales lanzando una búsqueda con debounce.
  aplicarFiltros() {
    if (this.validarAnio()) {
      this.searchSubject.next();
    }
  }


  // Método para restablecer todos los filtros a su estado por defecto y relanzar la búsqueda.
  limpiarFiltros() {
    this.filtros = {
      genero: [],
      plataforma: [],
      orden: 'relevance',
      tags: [],
      metacritic: [],
      anio: ''
    };
    this.errorAnio = false;
    this.reiniciarBusqueda();
    this.guardarEstado();
  }

  // Método para retroceder a la página anterior de resultados recargando desde la API.
  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      // Para volver atrás de forma segura con buffer, reiniciamos y cargamos hasta la página virtual
      this.reiniciarBusquedaVirtual();
    }
  }

  // Método para avanzar a la página siguiente de resultados de búsqueda.
  paginaSiguiente() {
    if (this.hayPaginaSiguiente || this.bufferJuegos.length > 0) {
      this.paginaActual++;
      this.ejecutarBusqueda();
      window.scrollTo(0, 0);
    }
  }

  private reiniciarBusquedaVirtual() {
    const targetPage = this.paginaActual;
    this.juegos = [];
    this.bufferJuegos = [];
    this.paginaApi = 1;
    this.hayPaginaSiguiente = true;
    this.cargando = true;
    this.cdr.detectChanges();
    this.cargarHastaPaginaVirtual(targetPage);
  }

  private cargarHastaPaginaVirtual(target: number) {
    if (target === 1) {
      this.ejecutarBusqueda();
      return;
    }
    
    this.videojuegosServicio.buscarJuegosPaginados(this.termino, this.paginaApi, this.filtros).subscribe({
      next: (respuesta: any) => {
        const rawResults = respuesta.results || [];
        const filtrados = rawResults.filter((juego: any) => this.cumpleFiltros(juego));


        this.bufferJuegos = [...this.bufferJuegos, ...filtrados];
        this.paginaApi++;
        this.hayPaginaSiguiente = respuesta.next !== null;

        if (this.bufferJuegos.length >= 20) {
          // Descartamos esta página y seguimos si no es el target
          if (target > 1) {
            this.bufferJuegos.splice(0, 20);
            this.cargarHastaPaginaVirtual(target - 1);
          } else {
            this.ejecutarBusqueda();
          }
        } else if (this.hayPaginaSiguiente) {
          this.cargarHastaPaginaVirtual(target); // Seguimos llenando el buffer para la página actual
        } else {
          this.ejecutarBusqueda();
        }
      }
    });
  }

  private cumpleFiltros(juego: any): boolean {
    // 0. Verificar Precisión del Texto (AND logic para palabras clave)
    if (this.termino && this.termino.trim().length > 2) {
      const palabras = this.termino.toLowerCase().split(' ').filter(p => p.length > 1);
      const nombreJuego = juego.name.toLowerCase();
      // Verificamos que el nombre del juego contenga TODAS las palabras buscadas
      const coincideTodo = palabras.every(p => nombreJuego.includes(p));
      if (!coincideTodo) return false;
    }

    // 1. Verificar Géneros (AND)

    if (this.filtros.genero.length > 0) {
      const matchGenres = this.filtros.genero.every((gId: string) => {
        if (gId === 'horror') return juego.tags?.some((t: any) => t.slug === 'horror');
        return juego.genres?.some((g: any) => g.id.toString() === gId);
      });
      if (!matchGenres) return false;
    }

    // 2. Verificar Plataformas (AND)
    if (this.filtros.plataforma.length > 0) {
      const matchPlatforms = this.filtros.plataforma.every((pId: string) => {
        return juego.parent_platforms?.some((p: any) => p.platform.id.toString() === pId);
      });
      if (!matchPlatforms) return false;
    }

    // 3. Verificar Tags (AND)
    if (this.filtros.tags.length > 0) {
      const matchTags = this.filtros.tags.every((tId: string) => {
        return juego.tags?.some((t: any) => t.id.toString() === tId);
      });
      if (!matchTags) return false;
    }

    // 4. Verificar Metacritic (OR)
    if (this.filtros.metacritic.length > 0) {
      const matchMetacritic = this.filtros.metacritic.some((mRange: string) => {
        const [min, max] = mRange.split(',').map(Number);
        return juego.metacritic >= min && juego.metacritic <= max;
      });
      if (!matchMetacritic) return false;
    }

    return true;
  }
}


