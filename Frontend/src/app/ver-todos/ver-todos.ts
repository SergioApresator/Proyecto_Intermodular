import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Videojuegos } from '../videojuegos';

@Component({
  selector: 'app-ver-todos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ver-todos.html',
  styleUrl: './ver-todos.css',
})

export class VerTodos implements OnInit {

  constructor(private videojuegosServicio: Videojuegos, private ruta: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  juegos: any[] = [];
  cargando: boolean = true;
  cargandoMas: boolean = false;
  titulo: string = '';
  genero: string = '';
  paginaActual: number = 1;
  hayMas: boolean = true;

  ngOnInit() {
    this.genero = this.ruta.snapshot.paramMap.get('genero') || '';

    if (this.genero === 'popular') this.titulo = 'Más Populares';
    else if (this.genero === 'action') this.titulo = 'Acción';
    else if (this.genero === 'horror') this.titulo = 'Terror';
    else if (this.genero === 'role-playing-games-rpg') this.titulo = 'RPG';
    else if (this.genero === 'proximos') this.titulo = 'Próximos Lanzamientos';

    //Carga la primera pagina
    this.cargarJuegos();
  }

  cargarJuegos() {
    if (this.genero === 'popular') {
      this.videojuegosServicio.getPopularesPaginados(this.paginaActual).subscribe({
        next: (respuesta: any) => {
          //Añade los juegos nuevos a la lista existente
          this.juegos = [...this.juegos, ...respuesta.results];
          //Si no hay siguiente pagina desactiva el boton
          this.hayMas = respuesta.next !== null;
          this.cargando = false;
          this.cargandoMas = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('Error al cargar juegos', err);
          this.cargando = false;
          this.cargandoMas = false;
        }
      });
    } else if (this.genero === 'proximos') {
      this.videojuegosServicio.getProximosPaginados(this.paginaActual).subscribe({
        next: (respuesta: any) => {
          this.juegos = [...this.juegos, ...respuesta.results];
          this.hayMas = respuesta.next !== null;
          this.cargando = false;
          this.cargandoMas = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('Error al cargar proximos lanzamientos', err);
          this.cargando = false;
          this.cargandoMas = false;
        }
      });
    } else {
      this.videojuegosServicio.getJuegosPaginados(this.genero, this.paginaActual).subscribe({
        next: (respuesta: any) => {
          this.juegos = [...this.juegos, ...respuesta.results];
          this.hayMas = respuesta.next !== null;
          this.cargando = false;
          this.cargandoMas = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('Error al cargar juegos', err);
          this.cargando = false;
          this.cargandoMas = false;
        }
      });
    }
  }

  //Se llama al pulsar el boton cargar mas
  cargarMas() {
    this.cargandoMas = true;
    this.paginaActual++;
    this.cargarJuegos();
  }
}