import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';



import { FormsModule } from '@angular/forms';
import { Videojuegos } from '../../services/videojuegos';
import { Usuarios } from '../../services/usuarios';
import { ResenasService } from '../../services/resenas';
import { RespuestasService } from '../../services/respuestas';
import { ConfirmModal } from '../confirm-modal/confirm-modal.component';
import { Footer } from '../footer/footer';



@Component({
  selector: 'app-juego-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Footer, ConfirmModal],


  templateUrl: './juego-detalle.html',
  styleUrl: './juego-detalle.css'
})
export class JuegoDetalle implements OnInit, OnDestroy {
  cargando: boolean = true;
  id: string | null = null;
  juego: any = null;
  
  mediaItems: any[] = [];
  indiceMediaActual: number = 0;
  intervaloMedia: any = null;

  esFavorito: boolean = false;
  listaFavoritoId: number | null = null;
  esPendiente: boolean = false;
  listaPendienteId: number | null = null;
  usuarioId: number | null = null;
  cambiandoFavorito: boolean = false;
  cambiandoPendiente: boolean = false;

  // Modal de confirmación genérico
  modalConfirmacionVisible: boolean = false;
  modalConfirmacionConfig = {
    titulo: 'CONFIRMAR',
    mensaje: '¿Estás seguro?',
    tipo: 'warning' as 'danger' | 'warning' | 'info',
    cancelText: 'CANCELAR',
    confirmText: 'CONFIRMAR',
    accion: () => {}
  };

  resenas: any[] = [];
  mostrarModalResena: boolean = false;
  enviandoResena: boolean = false;
  nuevaResena = {
    puntuacion: 5,
    mensaje: '',
    tieneSpoiler: false
  };
  mensajeLogin: string = '';

  listasUsuario: string[] = []; 
  juegosEnListas: any[] = []; 
  mostrarModalListas: boolean = false;
  nuevaListaNombre: string = "";
  procesandoLista: boolean = false;
  mostrarFormNuevaLista: boolean = false;

  // Getter para obtener los primeros 15 tags del juego para mostrarlos en la vista de detalle.
  get tagsJuego(): any[] {
    return this.juego?.tags ? this.juego.tags.slice(0, 15) : [];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videojuegosServicio: Videojuegos,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private usuariosServicio: Usuarios,
    private resenasServicio: ResenasService,
    private respuestasServicio: RespuestasService
  ) {}

  // Método para inicializar el componente leyendo el ID del juego de la URL y cargando sus datos.
  ngOnInit() {
    const uid = localStorage.getItem('usuarioId');
    if (uid) {
      this.usuarioId = parseInt(uid, 10);
    }

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.cargarDatos(this.id);
      } else {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método para cargar los detalles del juego, sus listas de usuario y las reseñas asociadas.
  cargarDatos(id: string) {
    this.cargando = true;
    this.mediaItems = [];
    this.indiceMediaActual = 0;
    this.resenas = [];
    this.cdr.detectChanges();

    this.videojuegosServicio.getJuegoDetalles(id).subscribe({
      next: (data) => {
        this.juego = data;
        if (this.juego.parent_platforms) {
          const platforms = new Set<string>();
          const newPlatforms: any[] = [];
          this.juego.parent_platforms.forEach((p: any) => {
            let name = p.platform.name;
            if (name === 'Apple Macintosh' || name === 'Mac') name = 'macOS';
            if (!platforms.has(name)) {
              platforms.add(name);
              p.platform.name = name;
              newPlatforms.push(p);
            }
          });
          this.juego.parent_platforms = newPlatforms;
        }


        if (this.juego.background_image) {
          this.mediaItems.push({ tipo: 'imagen', url: this.juego.background_image });
        }
        
        if (this.usuarioId) this.checkListas(id);
        this.cargarMediaExtra(id);
        this.cargarResenas(parseInt(id, 10));
      },
      error: () => {
        if (this.mediaItems.length > 1) this.iniciarCarruselMedia();
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método para cargar las capturas de pantalla del juego y añadirlas al carrusel de medios.
  cargarMediaExtra(id: string) {
    this.videojuegosServicio.getJuegoScreenshots(id).subscribe({
      next: (data) => {
        if (data?.results?.length > 0) {
          data.results.forEach((shot: any) => {
            if (shot.image && shot.image !== this.juego?.background_image) {
              this.mediaItems.push({ tipo: 'imagen', url: shot.image });
            }
          });
        }
        if (this.mediaItems.length > 1) this.iniciarCarruselMedia();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        if (this.mediaItems.length > 1) this.iniciarCarruselMedia();
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método para comprobar si el juego actual está en las listas del usuario (Favoritos, Pendientes, etc.).
  checkListas(gameIdStr: string) {
    if (!this.usuarioId) return;
    const gameId = parseInt(gameIdStr, 10);
    this.usuariosServicio.getListasUsuario(this.usuarioId).subscribe({
      next: (listas: any[]) => {
        this.ngZone.run(() => {
          this.juegosEnListas = listas;
          const fav = listas.find(l => l.nombre === 'Favoritos' && l.id_videojuego === gameId);
          this.esFavorito = !!fav;
          this.listaFavoritoId = fav ? fav.id : null;

          const pen = listas.find(l => l.nombre === 'Videojuegos Pendientes' && l.id_videojuego === gameId);
          this.esPendiente = !!pen;
          this.listaPendienteId = pen ? pen.id : null;

          const nombres = listas.map(l => l.nombre);
          nombres.push('Favoritos');
          nombres.push('Videojuegos Pendientes');
          this.listasUsuario = [...new Set(nombres)];
          this.cdr.detectChanges();
        });
      }
    });
  }

  // Método para abrir el modal de gestión de listas del juego, redirigiendo al login si no hay sesión.
  abrirModalListas() {
    if (!this.usuarioId) { this.router.navigate(['/login']); return; }
    this.mostrarModalListas = true;
    if (this.id) this.checkListas(this.id);
  }

  // Método para cerrar el modal de listas y limpiar el formulario de nueva lista.
  cerrarModalListas() {
    this.mostrarModalListas = false;
    this.nuevaListaNombre = "";
    this.mostrarFormNuevaLista = false;
  }

  // Método para comprobar si el juego actual está en una lista de usuario por su nombre.
  estaEnLista(nombre: string): boolean {
    return this.juegosEnListas.some(l => l.nombre === nombre && l.id_videojuego === this.juego?.id);
  }

  // Método para añadir o quitar el juego de una lista concreta del usuario de forma optimista.
  toggleJuegoEnLista(nombre: string) {
    this.ngZone.run(() => {
      if (!this.usuarioId || !this.juego || this.procesandoLista) return;
      const itemExistente = this.juegosEnListas.find(l => l.nombre === nombre && l.id_videojuego === this.juego.id);
      this.procesandoLista = true;
      
      if (itemExistente) {
        this.juegosEnListas = this.juegosEnListas.filter(l => l.id !== itemExistente.id);
      } else {
        this.juegosEnListas.push({ nombre, id_videojuego: this.juego.id, id: -1 });
      }
      this.cdr.detectChanges();

      if (itemExistente) {
        this.usuariosServicio.eliminarDeLista(itemExistente.id).subscribe({
          next: () => { 
            this.ngZone.run(() => {
              if (this.id) this.checkListas(this.id); 
              this.procesandoLista = false; 
              this.cdr.detectChanges();
            });
          },
          error: () => this.ngZone.run(() => { 
            if (this.id) this.checkListas(this.id);
            this.procesandoLista = false; 
            this.cdr.detectChanges(); 
          })
        });
      } else {
        const payload = { nombre, id_videojuego: this.juego.id, id_usuario: this.usuarioId };
        this.usuariosServicio.agregarALista(payload).subscribe({
          next: () => { 
            this.ngZone.run(() => {
              if (this.id) this.checkListas(this.id); 
              this.procesandoLista = false; 
              this.cdr.detectChanges();
            });
          },
          error: () => this.ngZone.run(() => { 
            if (this.id) this.checkListas(this.id);
            this.procesandoLista = false; 
            this.cdr.detectChanges(); 
          })
        });
      }
    });
  }

  // Método para crear una nueva lista con el nombre introducido y añadir el juego actual a ella.
  crearYAgregarALista() {
    const nombre = this.nuevaListaNombre.trim();
    if (!nombre || this.procesandoLista) return;
    this.toggleJuegoEnLista(nombre);
    this.nuevaListaNombre = "";
    this.mostrarFormNuevaLista = false;
  }

  // Método para añadir o quitar el juego de la lista de Favoritos del usuario.
  toggleFavorito() {
    this.ngZone.run(() => {
      if (!this.usuarioId) { this.router.navigate(['/login']); return; }
      if (!this.juego) return;
      this.cambiandoFavorito = true;
      this.cdr.detectChanges();

      if (this.esFavorito && this.listaFavoritoId) {
        this.usuariosServicio.eliminarDeLista(this.listaFavoritoId).subscribe({
          next: () => { 
            this.ngZone.run(() => {
              this.esFavorito = false; 
              this.listaFavoritoId = null; 
              this.cambiandoFavorito = false; 
              this.cdr.detectChanges(); 
            });
          },
          error: () => this.ngZone.run(() => { this.cambiandoFavorito = false; this.cdr.detectChanges(); })
        });
      } else {
        const payload = { nombre: 'Favoritos', id_videojuego: this.juego.id, id_usuario: this.usuarioId };
        this.usuariosServicio.agregarALista(payload).subscribe({
          next: (nuevaLista: any) => { 
            this.ngZone.run(() => {
              this.esFavorito = true; 
              this.listaFavoritoId = nuevaLista.id; 
              this.cambiandoFavorito = false; 
              this.cdr.detectChanges(); 
            });
          },
          error: () => this.ngZone.run(() => { this.cambiandoFavorito = false; this.cdr.detectChanges(); })
        });
      }
    });
  }

  // Método para añadir o quitar el juego de la lista de Videojuegos Pendientes del usuario.
  togglePendiente() {
    this.ngZone.run(() => {
      if (!this.usuarioId) { this.router.navigate(['/login']); return; }
      if (!this.juego) return;
      this.cambiandoPendiente = true;
      this.cdr.detectChanges();

      if (this.esPendiente && this.listaPendienteId) {
        this.usuariosServicio.eliminarDeLista(this.listaPendienteId).subscribe({
          next: () => { 
            this.ngZone.run(() => {
              this.esPendiente = false; 
              this.listaPendienteId = null; 
              this.cambiandoPendiente = false; 
              this.cdr.detectChanges(); 
            });
          },
          error: () => this.ngZone.run(() => { this.cambiandoPendiente = false; this.cdr.detectChanges(); })
        });
      } else {
        const payload = { nombre: 'Videojuegos Pendientes', id_videojuego: this.juego.id, id_usuario: this.usuarioId };
        this.usuariosServicio.agregarALista(payload).subscribe({
          next: (nuevaLista: any) => { 
            this.ngZone.run(() => {
              this.esPendiente = true; 
              this.listaPendienteId = nuevaLista.id; 
              this.cambiandoPendiente = false; 
              this.cdr.detectChanges(); 
            });
          },
          error: () => this.ngZone.run(() => { this.cambiandoPendiente = false; this.cdr.detectChanges(); })
        });
      }
    });
  }

  // Método para limpiar el intervalo del carrusel de medios al destruir el componente.
  ngOnDestroy() { this.detenerCarruselMedia(); }

  isScrubbing: boolean = false;
  // Método para iniciar el arrastre manual sobre la barra del carrusel de medios.
  onScrubStart(event: MouseEvent | TouchEvent, index: number) {
    if (event instanceof MouseEvent) event.preventDefault();
    this.isScrubbing = true;
    this.indiceMediaActual = index;
    this.detenerCarruselMedia();
  }
  // Método para actualizar el índice del carrusel mientras el usuario arrastra sobre la barra de medios.
  onScrubMove(index: number) {
    if (this.isScrubbing && this.indiceMediaActual !== index) { this.indiceMediaActual = index; this.cdr.detectChanges(); }
  }
  // Método para finalizar el arrastre y reanudar el carrusel automático de medios.
  onScrubEnd() { if (this.isScrubbing) { this.isScrubbing = false; this.iniciarCarruselMedia(); } }

  // Método para iniciar el carrusel automático de imágenes con un intervalo de 4 segundos.
  iniciarCarruselMedia() {
    this.detenerCarruselMedia();
    this.intervaloMedia = setInterval(() => {
      if (this.mediaItems.length > 0) {
        this.indiceMediaActual = (this.indiceMediaActual + 1) % this.mediaItems.length;
        this.cdr.detectChanges();
      }
    }, 4000);
  }
  // Método para detener el carrusel automático de medios limpiando el intervalo.
  detenerCarruselMedia() {
    if (this.intervaloMedia) { clearInterval(this.intervaloMedia); this.intervaloMedia = null; }
  }
  // Método para avanzar al siguiente elemento del carrusel de medios.
  siguienteMedia() { if (this.mediaItems.length > 0) { this.indiceMediaActual = (this.indiceMediaActual + 1) % this.mediaItems.length; this.iniciarCarruselMedia(); } }
  // Método para retroceder al elemento anterior del carrusel de medios.
  anteriorMedia() { if (this.mediaItems.length > 0) { this.indiceMediaActual = (this.indiceMediaActual - 1 + this.mediaItems.length) % this.mediaItems.length; this.iniciarCarruselMedia(); } }

  // Método para cargar las reseñas del juego junto con sus respuestas anidadas.
  cargarResenas(idVideojuego: number) {
    this.resenasServicio.getResenasPorJuego(idVideojuego, this.usuarioId || undefined).subscribe({
      next: (data) => {
        this.resenas = data.map((r: any) => ({
          ...r,
          respuestas: [],
          mostrarRespuestas: false,
          nuevaRespuestaTexto: '',
          respuestaPadreSeleccionada: null
        }));
        this.resenas.forEach(resena => {
          this.respuestasServicio.getRespuestasPorResena(resena.id, this.usuarioId || undefined).subscribe({
            next: (respuestas) => { 
              this.ngZone.run(() => {
                resena.respuestas = respuestas; 
                this.cdr.detectChanges(); 
              });
            }
          });
        });
        this.cdr.detectChanges();
      }
    });
  }

  // Método para mostrar u ocultar las respuestas de una reseña.
  toggleRespuestas(resena: any) { resena.mostrarRespuestas = !resena.mostrarRespuestas; this.cdr.detectChanges(); }
  // Método para seleccionar una respuesta como padre al que se está respondiendo.
  seleccionarParaResponder(resena: any, respuesta: any) {
    if (!this.usuarioId) { this.router.navigate(['/login']); return; }
    resena.respuestaPadreSeleccionada = respuesta;
    this.cdr.detectChanges();
  }
  // Método para publicar una respuesta a una reseña y añadirla a la lista de respuestas.
  enviarRespuesta(resena: any) {
    if (!this.usuarioId) { this.router.navigate(['/login']); return; }
    if (!resena.nuevaRespuestaTexto?.trim()) return;
    const parentId = resena.respuestaPadreSeleccionada?.id;
    this.respuestasServicio.crearRespuesta(resena.id, this.usuarioId, resena.nuevaRespuestaTexto, parentId).subscribe({
      next: (nuevaRespuesta) => {
        this.ngZone.run(() => {
          nuevaRespuesta.votoUsuarioActual = null;
          resena.respuestas.push(nuevaRespuesta);
          resena.nuevaRespuestaTexto = '';
          resena.mostrarRespuestas = true;
          resena.respuestaPadreSeleccionada = null;
          this.cdr.detectChanges();
        });
      }
    });
  }
  // Método para cancelar la selección de respuesta padre y limpiar el estado de respuesta.
  cancelarRespuesta(resena: any) { resena.respuestaPadreSeleccionada = null; this.cdr.detectChanges(); }

  // Método para registrar el voto del usuario sobre una respuesta y actualizar los contadores en la vista.
  votarRespuesta(resena: any, respuesta: any, esMeGusta: boolean) {
    if (!this.usuarioId) { this.router.navigate(['/login']); return; }
    this.respuestasServicio.votarRespuesta(respuesta.id, this.usuarioId, esMeGusta).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          respuesta.me_gustas = data.me_gustas ?? data.meGustas;
          respuesta.meGustas = data.meGustas ?? data.me_gustas;
          respuesta.no_me_gustas = data.no_me_gustas ?? data.noMeGustas;
          respuesta.noMeGustas = data.noMeGustas ?? data.no_me_gustas;
          respuesta.votoUsuarioActual = data.votoUsuarioActual;
          this.cdr.detectChanges();
        });
      }
    });
  }

  // Método para abrir el modal de creación de reseña, redirigiendo al login si no hay sesión.
  abrirModalResena() {
    if (!this.usuarioId) { this.router.navigate(['/login']); return; }
    this.mostrarModalResena = true;
  }
  // Método para cerrar el modal de reseña y resetear el formulario de nueva reseña.
  cerrarModalResena() {
    this.mostrarModalResena = false;
    this.nuevaResena = { puntuacion: 5, mensaje: '', tieneSpoiler: false };
  }
  // Método para enviar una nueva reseña del juego y añadirla al principio de la lista.
  enviarResena() {
    if (!this.usuarioId || !this.juego) return;
    if (this.nuevaResena.mensaje.trim().length === 0) { alert("El mensaje no puede estar vacío."); return; }
    this.enviandoResena = true;
    const payload = { ...this.nuevaResena, id_usuario: this.usuarioId, id_videojuego: this.juego.id, nombreVideojuego: this.juego.name, fotoVideojuego: this.juego.background_image };
    this.resenasServicio.crearResena(payload).subscribe({
      next: (data) => { this.resenas.unshift(data); this.enviandoResena = false; this.cerrarModalResena(); this.cdr.detectChanges(); },
      error: () => { alert("Ocurrió un error al enviar la reseña."); this.enviandoResena = false; this.cdr.detectChanges(); }
    });
  }

  // Método para registrar el voto del usuario sobre una reseña y actualizar los contadores en la vista.
  votarResena(resena: any, esMeGusta: boolean) {
    if (!this.usuarioId) { this.router.navigate(['/login']); return; }
    this.resenasServicio.votarResena(resena.id, this.usuarioId, esMeGusta).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          resena.me_gustas = data.me_gustas ?? data.meGustas;
          resena.meGustas = data.meGustas ?? data.me_gustas;
          resena.no_me_gustas = data.no_me_gustas ?? data.noMeGustas;
          resena.noMeGustas = data.noMeGustas ?? data.no_me_gustas;
          resena.votoUsuarioActual = data.votoUsuarioActual;
          this.cdr.detectChanges();
        });
      }
    });
  }

  // Método para reportar o retirar reporte de una reseña (toggle).
  reportarResena(resena: any) {
    if (!this.usuarioId) return;
    const yaReportada = resena.reportadoPorUsuarioActual;
    const titulo = yaReportada ? 'RETIRAR REPORTE' : 'REPORTAR RESEÑA';
    const mensaje = yaReportada
      ? '¿Deseas retirar tu reporte sobre esta reseña? Se eliminará tu denuncia del panel de moderación.'
      : '¿Estás seguro de que deseas reportar esta reseña por contenido inapropiado? Se enviará al panel de moderación para ser revisada.';

    this.mostrarConfirmacion(
      titulo,
      mensaje,
      'warning',
      () => {
        this.resenasServicio.reportarResena(resena.id, this.usuarioId!).subscribe({
          next: (data) => {
            this.ngZone.run(() => {
              resena.reportadoPorUsuarioActual = data.reportadoPorUsuarioActual;
              resena.reportes = data.reportes;
              const msgExito = data.reportadoPorUsuarioActual
                ? 'La reseña ha sido reportada con éxito al equipo de moderación. Gracias por tu colaboración.'
                : 'Tu reporte sobre esta reseña ha sido retirado correctamente.';
              this.mostrarConfirmacion(
                data.reportadoPorUsuarioActual ? 'RESEÑA REPORTADA' : 'REPORTE RETIRADO',
                msgExito,
                'warning',
                () => {},
                '',
                'ACEPTAR'
              );
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            console.error('Error al reportar:', err);
            this.mostrarConfirmacion(
              'ERROR',
              'Ocurrió un error al procesar el reporte.',
              'danger',
              () => {},
              '',
              'ACEPTAR'
            );
          }
        });
      }
    );
  }

  // Método para obtener el nombre de usuario de la respuesta padre a partir de su ID.
  getNombrePadre(resena: any, idPadre: number): string {
    if (!idPadre) return '';
    const padre = resena.respuestas.find((r: any) => r.id === idPadre);
    return padre ? (padre.nombre_usuario || padre.nombreUsuario) : '';
  }

  // Método para eliminar una reseña del juego previa confirmación del usuario.
  eliminarResena(idResena: number) {
    this.mostrarConfirmacion(
      'ELIMINAR RESEÑA',
      '¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer.',
      'danger',
      () => {
        this.resenasServicio.eliminarResena(idResena).subscribe({
          next: () => {
            this.resenas = this.resenas.filter(r => r.id !== idResena);
            this.cdr.detectChanges();
          },
          error: () => { alert('No se pudo eliminar la reseña.'); }
        });
      }
    );
  }

  // Método para eliminar una respuesta de una reseña previa confirmación del usuario.
  eliminarRespuesta(resena: any, idRespuesta: number) {
    this.mostrarConfirmacion(
      'ELIMINAR RESPUESTA',
      '¿Estás seguro de que deseas eliminar esta respuesta?',
      'danger',
      () => {
        this.respuestasServicio.eliminarRespuesta(idRespuesta).subscribe({
          next: () => {
            resena.respuestas = resena.respuestas.filter((r: any) => r.id !== idRespuesta);
            this.cdr.detectChanges();
          },
          error: () => { alert('No se pudo eliminar la respuesta.'); }
        });
      }
    );
  }

  // Helpers para el modal de confirmación
  // Método para mostrar el modal de confirmación con el título, mensaje, tipo y acción a ejecutar.
  mostrarConfirmacion(titulo: string, mensaje: string, tipo: 'danger' | 'warning', accion: () => void, cancelText: string = 'CANCELAR', confirmText: string = 'CONFIRMAR') {
    this.modalConfirmacionConfig = { titulo, mensaje, tipo, accion, cancelText, confirmText };
    this.modalConfirmacionVisible = true;
    this.cdr.detectChanges();
  }

  // Método para ejecutar la acción confirmada y cerrar el modal.
  ejecutarConfirmacion() {
    this.modalConfirmacionConfig.accion();
    this.modalConfirmacionVisible = false;
    this.cdr.detectChanges();
  }

  // Método para cerrar el modal de confirmación sin ejecutar ninguna acción.
  cancelarConfirmacion() {
    this.modalConfirmacionVisible = false;
    this.cdr.detectChanges();
  }
}


