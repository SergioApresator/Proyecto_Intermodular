import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  cargandoMas: boolean = false;
  termino: string = '';
  paginaActual: number = 1;
  hayMas: boolean = true;

  // Filtros
  filtros: any = {
    genero: '',
    plataforma: '',
    orden: '-added'
  };

  generosDisponibles = [
    { id: '', nombre: 'Todos los géneros' },
    { id: '4', nombre: 'Acción' },
    { id: '51', nombre: 'Indie' },
    { id: '3', nombre: 'Aventura' },
    { id: '5', nombre: 'RPG' },
    { id: '10', nombre: 'Estrategia' },
    { id: '2', nombre: 'Shooter' },
    { id: '40', nombre: 'Carreras' },
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

  ordenDisponibles = [
    { id: 'relevance', nombre: 'Relevancia' },
    { id: '-added', nombre: 'Más recientes' },
    { id: '-rating', nombre: 'Mejor valorados' },
    { id: '-metacritic', nombre: 'Metacritic' },
    { id: 'released', nombre: 'Fecha lanzamiento' },
    { id: 'name', nombre: 'Nombre (A-Z)' },
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.termino = params['q'] || '';
      this.reiniciarBusqueda();
    });
  }

  reiniciarBusqueda() {
    this.juegos = [];
    this.paginaActual = 1;
    this.hayMas = true;
    this.cargando = true;
    this.ejecutarBusqueda();
  }

  ejecutarBusqueda() {
    if (!this.termino.trim()) {
      this.cargando = false;
      return;
    }

    this.videojuegosServicio.buscarJuegosPaginados(this.termino, this.paginaActual, this.filtros).subscribe({
      next: (respuesta: any) => {
        this.juegos = [...this.juegos, ...respuesta.results];
        this.hayMas = respuesta.next !== null;
        this.cargando = false;
        this.cargandoMas = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error en búsqueda:', err);
        this.cargando = false;
        this.cargandoMas = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros() {
    this.reiniciarBusqueda();
  }

  cargarMas() {
    if (this.hayMas && !this.cargandoMas) {
      this.cargandoMas = true;
      this.paginaActual++;
      this.ejecutarBusqueda();
    }
  }
}
