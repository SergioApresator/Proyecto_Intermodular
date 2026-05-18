import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResenasService } from '../../services/resenas';
import { Videojuegos } from '../../services/videojuegos';
import { Footer } from '../footer/footer';


@Component({
  selector: 'app-diario',
  standalone: true,
  imports: [CommonModule, RouterLink, Footer],

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
  
  // Modal para ver más
  mostrarModalDetalle: boolean = false;
  resenaSeleccionada: any = null;



  // Método para inicializar el componente y cargar las reseñas y respuestas del usuario autenticado.
  ngOnInit() {
    const uid = localStorage.getItem('usuarioId');
    if (uid) {
      this.usuarioId = parseInt(uid, 10);
      this.cargarResenas();
      this.cargarRespuestas();
    }
  }

  // Método para cargar las reseñas del usuario y enriquecerlas con el nombre e imagen del juego correspondiente.
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

  // Método para cargar las respuestas del usuario y enriquecerlas con el mensaje y autor de la reseña original.
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
              resp.usuarioResena = resena.nombreUsuario;
              resp.id_videojuego = resena.id_videojuego;
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

  // Método para agrupar una lista de elementos por su fecha y ordenarlos de más reciente a más antiguo.
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


  // Método para cambiar la vista del diario para mostrar la pestaña de reseñas.
  mostrarResenas() {
    this.mostrandoResenas = true;
  }

  // Método para cambiar la vista del diario para mostrar la pestaña de respuestas.
  mostrarRespuestas() {
    this.mostrandoResenas = false;
  }

  // Método para abrir el modal de detalle con la reseña seleccionada.
  abrirModal(resena: any) {
    this.resenaSeleccionada = resena;
    this.mostrarModalDetalle = true;
  }

  // Método para cerrar el modal de detalle y limpiar la reseña seleccionada.
  cerrarModal() {
    this.mostrarModalDetalle = false;
    this.resenaSeleccionada = null;
  }
}