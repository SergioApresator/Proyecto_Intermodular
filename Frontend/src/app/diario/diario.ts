import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResenasService } from '../resenas';
import { Videojuegos } from '../videojuegos';

@Component({
  selector: 'app-diario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './diario.html',
  styleUrl: './diario.css',
})

export class Diario implements OnInit {

  constructor(private resenasServicio: ResenasService, private videojuegosServicio: Videojuegos, private cdr: ChangeDetectorRef) {}

  respuestas: any[] = [];
  mostrandoResenas: boolean = true;
  resenas: any[] = [];
  cargando: boolean = true;
  usuarioId: number | null = null;

  ngOnInit() {
    const uid = localStorage.getItem('usuarioId');
    if (uid) {
      this.usuarioId = parseInt(uid, 10);
      this.cargarResenas();
      this.cargarRespuestas();
    }
  }

  cargarResenas() {
    if (!this.usuarioId) return;

    this.resenasServicio.getResenasPorUsuario(this.usuarioId).subscribe({
      next: (respuesta: any) => {
        this.resenas = respuesta.sort((a: any, b: any) => {
          return b.id - a.id;
        });
        //En cada reseña carga esto
        this.resenas.forEach((resena: any) => {
          this.videojuegosServicio.getJuegoDetalles(resena.id_videojuego.toString()).subscribe({
            next: (juego: any) => {
              resena.nombreJuego = juego.name;
              resena.imagenJuego = juego.background_image;
              this.cdr.detectChanges();
            },
            error: (err: any) => {
              console.log('Error al cargar datos del juego', err);
            }
          });
        });
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar las resenas', err);
        this.cargando = false;
      }
    });
  }

  cargarRespuestas() {
    if (!this.usuarioId) return;

    this.resenasServicio.getRespuestasPorUsuario(this.usuarioId).subscribe({
      next: (respuesta: any) => {
        this.respuestas = respuesta.sort((a: any, b: any) => {
          return b.id - a.id;
        });
        //Por cada respuesta cargamos el mensaje de la resena a la que pertenece
        this.respuestas.forEach((resp: any) => {
          this.resenasServicio.getResenaPorId(resp.id_resena).subscribe({
            next: (resena: any) => {
              resp.mensajeResena = resena.mensaje;
              this.cdr.detectChanges();
            },
            error: (err: any) => {
              console.log('Error al cargar la resena', err);
            }
          });
        });
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar las respuestas', err);
      }
    });
  }

  mostrarResenas() {
    this.mostrandoResenas = true;
  }

  mostrarRespuestas() {
    this.mostrandoResenas = false;
  }
}