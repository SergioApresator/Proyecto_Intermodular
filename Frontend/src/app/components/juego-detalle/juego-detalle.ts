import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  imports: [CommonModule, FormsModule, Footer, ConfirmModal],


  templateUrl: './juego-detalle.html',
  styleUrl: './juego-detalle.css'
})
export class JuegoDetalle implements OnInit, OnDestroy {
  cargando: boolean = true;
  id: string | null = null;
  juego: any = null;
  descripcionSegura: SafeHtml = '';
  
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

  get tagsJuego(): any[] {
    return this.juego?.tags ? this.juego.tags.slice(0, 15) : [];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videojuegosServicio: Videojuegos,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private usuariosServicio: Usuarios,
    private resenasServicio: ResenasService,
    private respuestasServicio: RespuestasService
  ) {}

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

        this.descripcionSegura = this.sanitizer.bypassSecurityTrustHtml(this.juego.description || '');
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

          this.listasUsuario = [...new Set(listas.map(l => l.nombre))];
          this.cdr.detectChanges();
        });
      }
    });
  }

  abrirModalListas() {
    if (!this.usuarioId) { this.router.navigate(['/login']); return; }
    this.mostrarModalListas = true;
    if (this.id) this.checkListas(this.id);
  }

  cerrarModalListas() {
    this.mostrarModalListas = false;
    this.nuevaListaNombre = "";
    this.mostrarFormNuevaLista = false;
  }

  estaEnLista(nombre: string): boolean {
    return this.juegosEnListas.some(l => l.nombre === nombre && l.id_videojuego === this.juego?.id);
  }

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

  crearYAgregarALista() {
    const nombre = this.nuevaListaNombre.trim();
    if (!nombre || this.procesandoLista) return;
    this.toggleJuegoEnLista(nombre);
    this.nuevaListaNombre = "";
    this.mostrarFormNuevaLista = false;
  }

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

  ngOnDestroy() { this.detenerCarruselMedia(); }

  isScrubbing: boolean = false;
  onScrubStart(event: MouseEvent | TouchEvent, index: number) {
    if (event instanceof MouseEvent) event.preventDefault();
    this.isScrubbing = true;
    this.indiceMediaActual = index;
    this.detenerCarruselMedia();
  }
  onScrubMove(index: number) {
    if (this.isScrubbing && this.indiceMediaActual !== index) { this.indiceMediaActual = index; this.cdr.detectChanges(); }
  }
  onScrubEnd() { if (this.isScrubbing) { this.isScrubbing = false; this.iniciarCarruselMedia(); } }

  iniciarCarruselMedia() {
    this.detenerCarruselMedia();
    this.intervaloMedia = setInterval(() => {
      if (this.mediaItems.length > 0) {
        this.indiceMediaActual = (this.indiceMediaActual + 1) % this.mediaItems.length;
        this.cdr.detectChanges();
      }
    }, 4000);
  }
  detenerCarruselMedia() {
    if (this.intervaloMedia) { clearInterval(this.intervaloMedia); this.intervaloMedia = null; }
  }
  siguienteMedia() { if (this.mediaItems.length > 0) { this.indiceMediaActual = (this.indiceMediaActual + 1) % this.mediaItems.length; this.iniciarCarruselMedia(); } }
  anteriorMedia() { if (this.mediaItems.length > 0) { this.indiceMediaActual = (this.indiceMediaActual - 1 + this.mediaItems.length) % this.mediaItems.length; this.iniciarCarruselMedia(); } }

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

  toggleRespuestas(resena: any) { resena.mostrarRespuestas = !resena.mostrarRespuestas; this.cdr.detectChanges(); }
  seleccionarParaResponder(resena: any, respuesta: any) {
    if (!this.usuarioId) { this.router.navigate(['/login']); return; }
    resena.respuestaPadreSeleccionada = respuesta;
    this.cdr.detectChanges();
  }
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
  cancelarRespuesta(resena: any) { resena.respuestaPadreSeleccionada = null; this.cdr.detectChanges(); }

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

  abrirModalResena() {
    if (!this.usuarioId) { this.router.navigate(['/login']); return; }
    this.mostrarModalResena = true;
  }
  cerrarModalResena() {
    this.mostrarModalResena = false;
    this.nuevaResena = { puntuacion: 5, mensaje: '', tieneSpoiler: false };
  }
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

  getNombrePadre(resena: any, idPadre: number): string {
    if (!idPadre) return '';
    const padre = resena.respuestas.find((r: any) => r.id === idPadre);
    return padre ? (padre.nombre_usuario || padre.nombreUsuario) : '';
  }

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
  mostrarConfirmacion(titulo: string, mensaje: string, tipo: 'danger' | 'warning', accion: () => void) {
    this.modalConfirmacionConfig = { titulo, mensaje, tipo, accion };
    this.modalConfirmacionVisible = true;
    this.cdr.detectChanges();
  }

  ejecutarConfirmacion() {
    this.modalConfirmacionConfig.accion();
    this.modalConfirmacionVisible = false;
    this.cdr.detectChanges();
  }

  cancelarConfirmacion() {
    this.modalConfirmacionVisible = false;
    this.cdr.detectChanges();
  }
}


