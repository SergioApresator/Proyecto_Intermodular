import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Videojuegos } from '../videojuegos';

@Component({
  selector: 'app-inicial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicial.html',
  styleUrl: './inicial.css',
})

export class Inicial implements OnInit, OnDestroy {

  //Inyecto el servicio y el detector de cambios
  constructor(private videojuegosServicio: Videojuegos, private cdr: ChangeDetectorRef) {}

  juegosDestacados: any[] = [];
  indiceCarrusel: number = 0;
  intervaloCarrusel: any = null;
  cargando: boolean = true;

  juegosAccion: any[] = [];
  juegosHorror: any[] = [];
  juegosRPG: any[] = [];
  masPopulares: any[] = [];
  proximosLanzamientos: any[] = [];

  ngOnInit() {

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
    }
  }

  anteriorSlide() {
    if (this.juegosDestacados.length > 0) {
      this.indiceCarrusel = (this.indiceCarrusel - 1 + this.juegosDestacados.length) % this.juegosDestacados.length;
    }
  }
}