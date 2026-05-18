import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Videojuegos } from '../../services/videojuegos';

import { Footer } from '../footer/footer';

@Component({
  selector: 'app-ver-todos',
  standalone: true,
  imports: [CommonModule, RouterLink, Footer],
  templateUrl: './ver-todos.html',
  styleUrl: './ver-todos.css',
})

export class VerTodos implements OnInit {

  constructor(private videojuegosServicio: Videojuegos, private ruta: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  juegos: any[] = [];
  cargando: boolean = true;
  titulo: string = '';
  genero: string = '';
  paginaActual: number = 1;
  hayPaginaSiguiente: boolean = true;

  // Método para inicializar el componente leyendo el género de la URL y cargando la primera página de juegos.
  ngOnInit() {
    this.genero = this.ruta.snapshot.paramMap.get('genero') || '';

    if (this.genero === 'popular') this.titulo = 'Más Populares';
    else if (this.genero === 'action') this.titulo = 'Acción';
    else if (this.genero === 'horror') this.titulo = 'Terror';
    else if (this.genero === 'role-playing-games-rpg') this.titulo = 'RPG';
    else if (this.genero === 'proximos') this.titulo = 'Próximos Lanzamientos';
    else if (this.genero === 'shooter') this.titulo = 'Shooter';
    else if (this.genero === 'adventure') this.titulo = 'Aventura';
    else if (this.genero === 'sports') this.titulo = 'Deportes';
    else if (this.genero === 'indie') this.titulo = 'Indie';

    //Carga la primera pagina
    this.cargarJuegos();
  }

  // Método para cargar los juegos de la página actual según el género o categoría seleccionada.
  cargarJuegos() {
    this.cargando = true; this.cdr.detectChanges();
    if (this.genero === 'popular') {
      this.videojuegosServicio.getPopularesPaginados(this.paginaActual).subscribe({
        next: (respuesta: any) => {
          //Añade los juegos nuevos a la lista existente
          this.juegos = respuesta.results
          //Si no hay siguiente pagina desactiva el boton
          this.hayPaginaSiguiente = respuesta.next !== null;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('Error al cargar juegos', err);
          this.cargando = false;
        }
      });
    } else if (this.genero === 'proximos') {
      this.videojuegosServicio.getProximosPaginados(this.paginaActual).subscribe({
        next: (respuesta: any) => {
          this.juegos = respuesta.results
          this.hayPaginaSiguiente = respuesta.next !== null;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('Error al cargar proximos lanzamientos', err);
          this.cargando = false;
        }
      });
    } else {
      this.videojuegosServicio.getJuegosPaginados(this.genero, this.paginaActual).subscribe({
        next: (respuesta: any) => {
          this.juegos = respuesta.results
          this.hayPaginaSiguiente = respuesta.next !== null;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('Error al cargar juegos', err);
          this.cargando = false;
        }
      });
    }
  }

  // Método para retroceder a la página anterior de juegos y desplazar la vista al inicio.
  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarJuegos();
      window.scrollTo(0, 0);
    }
  }

  // Método para avanzar a la siguiente página de juegos y desplazar la vista al inicio.
  paginaSiguiente() {
    if (this.hayPaginaSiguiente) {
      this.paginaActual++;
      this.cargarJuegos();
      window.scrollTo(0, 0);
    }
  }
}