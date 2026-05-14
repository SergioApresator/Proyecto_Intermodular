import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Videojuegos } from '../videojuegos';

import { Footer } from '../footer/footer';

@Component({
  selector: 'app-ver-todos',
  standalone: true,
  imports: [CommonModule, RouterLink, Footer],
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
    else if (this.genero === 'shooter') this.titulo = 'Shooter';
    else if (this.genero === 'adventure') this.titulo = 'Aventura';
    else if (this.genero === 'sports') this.titulo = 'Deportes';
    else if (this.genero === 'indie') this.titulo = 'Indie';

    //Carga la primera pagina
    this.cargarJuegos();
  }

  cargarJuegos(append: boolean = false) {
    if (!append) {
      this.cargando = true;
      this.juegos = [];
      this.paginaActual = 1;
    } else {
      this.cargandoMas = true;
    }
    this.cdr.detectChanges();

    const observer = {
      next: (respuesta: any) => {
        if (append) {
          this.juegos = [...this.juegos, ...respuesta.results];
        } else {
          this.juegos = respuesta.results;
        }
        this.hayMas = respuesta.next !== null;
        this.cargando = false;
        this.cargandoMas = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar juegos', err);
        this.cargando = false;
        this.cargandoMas = false;
        this.cdr.detectChanges();
      }
    };

    if (this.genero === 'popular') {
      this.videojuegosServicio.getPopularesPaginados(this.paginaActual).subscribe(observer);
    } else if (this.genero === 'proximos') {
      this.videojuegosServicio.getProximosPaginados(this.paginaActual).subscribe(observer);
    } else {
      this.videojuegosServicio.getJuegosPaginados(this.genero, this.paginaActual).subscribe(observer);
    }
  }

  cargarMas() {
    this.paginaActual++;
    this.cargarJuegos(true);
  }
}