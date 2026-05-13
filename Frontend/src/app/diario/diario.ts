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

  respuestasAgrupadas: any[] = [];
  mostrandoResenas: boolean = true;
  resenasAgrupadas: any[] = [];
  resenas: any[] = []; // Para el conteo total
  respuestas: any[] = []; // Para el conteo total
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
        this.resenas = respuesta;
        this.resenasAgrupadas = this.agruparPorFecha(respuesta, 'fechaResena');
        
        //En cada reseña carga esto
        respuesta.forEach((resena: any) => {
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
        this.respuestas = respuesta;
        this.respuestasAgrupadas = this.agruparPorFecha(respuesta, 'fecha_respuesta'); // O fechaRespuesta
        
        //Por cada respuesta cargamos el mensaje de la resena a la que pertenece
        respuesta.forEach((resp: any) => {
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

  agruparPorFecha(items: any[], campoFecha: string): any[] {
    const grupos: { [key: string]: any[] } = {};

    items.forEach(item => {
      // Intentar obtener la fecha de cualquiera de los dos posibles nombres de campo
      const fechaValor = item[campoFecha] || item['fechaRespuesta'] || item['fechaResena'];
      if (!fechaValor) return;

      const date = new Date(fechaValor);
      const key = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!grupos[key]) {
        grupos[key] = [];
      }
      grupos[key].push(item);
    });

    // Convertir el objeto a array y ordenar por fecha descendente
    return Object.keys(grupos)
      .sort((a, b) => b.localeCompare(a))
      .map(fecha => ({
        fecha: fecha,
        items: grupos[fecha].sort((a, b) => b.id - a.id) // Ordenar items dentro del grupo por ID desc
      }));
  }


  mostrarResenas() {
    this.mostrandoResenas = true;
  }

  mostrarRespuestas() {
    this.mostrandoResenas = false;
  }
}