import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Videojuegos } from '../videojuegos';
import { Usuarios } from '../usuarios';
import { ResenasService } from '../resenas';
import { RespuestasService } from '../respuestas';

@Component({
  selector: 'app-juego-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './juego-detalle.html',
  styleUrl: './juego-detalle.css'
})
export class JuegoDetalle implements OnInit, OnDestroy {
  cargando: boolean = true;
  id: string | null = null;
  juego: any = null;
  descripcionSegura: SafeHtml = '';
  
  // Media Carousel
  mediaItems: any[] = [];
  indiceMediaActual: number = 0;
  intervaloMedia: any = null;

  // Favoritos y Listas Especiales
  esFavorito: boolean = false;
  listaFavoritoId: number | null = null;
  esPendiente: boolean = false;
  listaPendienteId: number | null = null;
  usuarioId: number | null = null;
  cambiandoFavorito: boolean = false;
  cambiandoPendiente: boolean = false;

  // Reseñas
  resenas: any[] = [];
  mostrarModalResena: boolean = false;
  enviandoResena: boolean = false;
  nuevaResena = {
    puntuacion: 5,
    mensaje: '',
    tieneSpoiler: false
  };

  // Listas Personalizadas
  listasUsuario: string[] = []; // Nombres de listas únicas
  juegosEnListas: any[] = []; // Items de lista brutos
  mostrarModalListas: boolean = false;
  nuevaListaNombre: string = "";
  procesandoLista: boolean = false;

  get tagsJuego(): any[] {
    return this.juego?.tags ? this.juego.tags.slice(0, 15) : [];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videojuegosServicio: Videojuegos,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
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
        
        // Remove Apple Macintosh and map to PC
        if (this.juego.parent_platforms) {
          const platforms = new Set<string>();
          const newPlatforms: any[] = [];
          this.juego.parent_platforms.forEach((p: any) => {
            let name = p.platform.name;
            if (name === 'Apple Macintosh' || name === 'Mac') {
              name = 'macOS';
            }
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
        
        if (this.usuarioId) {
          this.checkListas(id);
        }
        
        this.cargarMediaExtra(id);
        this.cargarResenas(parseInt(id, 10));
      },
      error: (err) => {
        if (this.mediaItems.length > 1) {
          this.iniciarCarruselMedia();
        }
        
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarMediaExtra(id: string) {
    this.videojuegosServicio.getJuegoScreenshots(id).subscribe({
      next: (data) => {
        if (data && data.results && data.results.length > 0) {
          data.results.forEach((shot: any) => {
            if (shot.image && shot.image !== this.juego?.background_image) {
              this.mediaItems.push({ tipo: 'imagen', url: shot.image });
            }
          });
        }
        
        if (this.mediaItems.length > 1) {
          this.iniciarCarruselMedia();
        }
        
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (this.mediaItems.length > 1) {
          this.iniciarCarruselMedia();
        }
        
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
        this.juegosEnListas = listas;
        
        // Actualizar favoritos
        const fav = listas.find(l => l.nombre === 'Favoritos' && l.id_videojuego === gameId);
        if (fav) {
          this.esFavorito = true;
          this.listaFavoritoId = fav.id;
        } else {
          this.esFavorito = false;
          this.listaFavoritoId = null;
        }

        // Actualizar pendientes
        const pen = listas.find(l => l.nombre === 'Videojuegos Pendientes' && l.id_videojuego === gameId);
        if (pen) {
          this.esPendiente = true;
          this.listaPendienteId = pen.id;
        } else {
          this.esPendiente = false;
          this.listaPendienteId = null;
        }

        // Actualizar nombres de listas únicas
        this.listasUsuario = [...new Set(listas.map(l => l.nombre))];
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error comprobando listas', err)
    });
  }

  // --- LISTAS PERSONALIZADAS ---
  abrirModalListas() {
    if (!this.usuarioId) {
      this.router.navigate(['/login']);
      return;
    }
    this.mostrarModalListas = true;
    if (this.id) this.checkListas(this.id);
  }

  cerrarModalListas() {
    this.mostrarModalListas = false;
    this.nuevaListaNombre = "";
  }

  estaEnLista(nombre: string): boolean {
    const gameId = this.juego?.id;
    return this.juegosEnListas.some(l => l.nombre === nombre && l.id_videojuego === gameId);
  }

  toggleJuegoEnLista(nombre: string) {
    if (!this.usuarioId || !this.juego || this.procesandoLista) return;

    const itemExistente = this.juegosEnListas.find(l => l.nombre === nombre && l.id_videojuego === this.juego.id);
    this.procesandoLista = true;

    if (itemExistente) {
      // Quitar de la lista
      this.usuariosServicio.eliminarDeLista(itemExistente.id).subscribe({
        next: () => {
          if (this.id) this.checkListas(this.id);
          this.procesandoLista = false;
        },
        error: () => this.procesandoLista = false
      });
    } else {
      // Añadir a la lista
      const payload = {
        nombre: nombre,
        id_videojuego: this.juego.id,
        id_usuario: this.usuarioId
      };
      this.usuariosServicio.agregarALista(payload).subscribe({
        next: () => {
          if (this.id) this.checkListas(this.id);
          this.procesandoLista = false;
        },
        error: () => this.procesandoLista = false
      });
    }
  }

  crearYAgregarALista() {
    const nombre = this.nuevaListaNombre.trim();
    if (!nombre || this.procesandoLista) return;
    
    this.toggleJuegoEnLista(nombre);
    this.nuevaListaNombre = "";
  }

  toggleFavorito() {
    if (!this.usuarioId || !this.juego) return;
    
    this.cambiandoFavorito = true;
    
    if (this.esFavorito && this.listaFavoritoId) {
      // Remover de favoritos
      this.usuariosServicio.eliminarDeLista(this.listaFavoritoId).subscribe({
        next: () => {
          this.esFavorito = false;
          this.listaFavoritoId = null;
          this.cambiandoFavorito = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al remover favorito', err);
          this.cambiandoFavorito = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Agregar a favoritos
      const payload = {
        nombre: 'Favoritos',
        id_videojuego: this.juego.id,
        id_usuario: this.usuarioId
      };
      
      this.usuariosServicio.agregarALista(payload).subscribe({
        next: (nuevaLista: any) => {
          this.esFavorito = true;
          this.listaFavoritoId = nuevaLista.id;
          this.cambiandoFavorito = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al agregar favorito', err);
          this.cambiandoFavorito = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  togglePendiente() {
    if (!this.usuarioId || !this.juego) return;
    
    this.cambiandoPendiente = true;
    
    if (this.esPendiente && this.listaPendienteId) {
      // Remover de pendientes
      this.usuariosServicio.eliminarDeLista(this.listaPendienteId).subscribe({
        next: () => {
          this.esPendiente = false;
          this.listaPendienteId = null;
          this.cambiandoPendiente = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al remover de pendientes', err);
          this.cambiandoPendiente = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Agregar a pendientes
      const payload = {
        nombre: 'Videojuegos Pendientes',
        id_videojuego: this.juego.id,
        id_usuario: this.usuarioId
      };
      
      this.usuariosServicio.agregarALista(payload).subscribe({
        next: (nuevaLista: any) => {
          this.esPendiente = true;
          this.listaPendienteId = nuevaLista.id;
          this.cambiandoPendiente = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al agregar a pendientes', err);
          this.cambiandoPendiente = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  ngOnDestroy() {
    this.detenerCarruselMedia();
  }

  // --- CAROUSEL SCRUBBING ---
  isScrubbing: boolean = false;

  onScrubStart(event: MouseEvent | TouchEvent, index: number) {
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }
    this.isScrubbing = true;
    this.indiceMediaActual = index;
    this.detenerCarruselMedia();
  }

  onScrubMove(index: number) {
    if (this.isScrubbing && this.indiceMediaActual !== index) {
      this.indiceMediaActual = index;
      this.cdr.detectChanges();
    }
  }

  onScrubEnd() {
    if (this.isScrubbing) {
      this.isScrubbing = false;
      this.iniciarCarruselMedia();
    }
  }

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
    if (this.intervaloMedia) {
      clearInterval(this.intervaloMedia);
      this.intervaloMedia = null;
    }
  }

  siguienteMedia() {
    if (this.mediaItems.length > 0) {
      this.indiceMediaActual = (this.indiceMediaActual + 1) % this.mediaItems.length;
      this.iniciarCarruselMedia();
    }
  }

  anteriorMedia() {
    if (this.mediaItems.length > 0) {
      this.indiceMediaActual = (this.indiceMediaActual - 1 + this.mediaItems.length) % this.mediaItems.length;
      this.iniciarCarruselMedia();
    }
  }

  // --- RESEÑAS ---
  cargarResenas(idVideojuego: number) {
    this.resenasServicio.getResenasPorJuego(idVideojuego).subscribe({
      next: (data) => {
        this.resenas = data.map((r: any) => ({
          ...r,
          respuestas: [],
          mostrarRespuestas: false,
          nuevaRespuestaTexto: '',
          respuestaPadreSeleccionada: null as any // { id: number, username: string }
        }));
        
        // Cargar respuestas para cada reseña
        this.resenas.forEach(resena => {
          this.respuestasServicio.getRespuestasPorResena(resena.id, this.usuarioId || undefined).subscribe({
            next: (respuestas) => {
              resena.respuestas = respuestas;
              this.cdr.detectChanges();
            }
          });
        });
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando reseñas', err)
    });
  }

  toggleRespuestas(resena: any) {
    resena.mostrarRespuestas = !resena.mostrarRespuestas;
    this.cdr.detectChanges();
  }

  enviarRespuesta(resena: any) {
    if (!this.usuarioId || !resena.nuevaRespuestaTexto.trim()) return;

    const parentId = resena.respuestaPadreSeleccionada?.id;

    this.respuestasServicio.crearRespuesta(resena.id, this.usuarioId, resena.nuevaRespuestaTexto, parentId).subscribe({
      next: (nuevaRespuesta) => {
        // Inicializar campos de UI para la nueva respuesta
        nuevaRespuesta.votoUsuarioActual = null;
        resena.respuestas.push(nuevaRespuesta);
        resena.nuevaRespuestaTexto = '';
        resena.mostrarRespuestas = true;
        resena.respuestaPadreSeleccionada = null; // Limpiar selección
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error enviando respuesta', err)
    });
  }

  seleccionarParaResponder(resena: any, resp: any) {
    resena.respuestaPadreSeleccionada = {
      id: resp.id,
      username: resp.nombreUsuario || 'Usuario'
    };
    // Scroll al input si es necesario (opcional)
    this.cdr.detectChanges();
  }

  cancelarRespuesta(resena: any) {
    resena.respuestaPadreSeleccionada = null;
    this.cdr.detectChanges();
  }

  votarRespuesta(resp: any, esMeGusta: boolean) {
    if (!this.usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    if (resp.id_usuario === this.usuarioId) return;

    this.respuestasServicio.votarRespuesta(resp.id, this.usuarioId, esMeGusta).subscribe({
      next: (data) => {
        resp.meGustas = data.meGustas;
        resp.noMeGustas = data.noMeGustas;
        resp.votoUsuarioActual = data.votoUsuarioActual;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al votar respuesta', err)
    });
  }

  abrirModalResena() {
    if (!this.usuarioId) {
      this.router.navigate(['/login']);
      return;
    }
    this.mostrarModalResena = true;
  }

  cerrarModalResena() {
    this.mostrarModalResena = false;
    this.nuevaResena = { puntuacion: 5, mensaje: '', tieneSpoiler: false };
  }

  enviarResena() {
    if (!this.usuarioId || !this.juego) return;
    
    if (this.nuevaResena.mensaje.trim().length === 0) {
      alert("El mensaje no puede estar vacío.");
      return;
    }

    this.enviandoResena = true;
    const payload = {
      ...this.nuevaResena,
      id_usuario: this.usuarioId,
      id_videojuego: this.juego.id
    };

    this.resenasServicio.crearResena(payload).subscribe({
      next: (data) => {
        this.resenas.unshift(data);
        this.enviandoResena = false;
        this.cerrarModalResena();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error enviando reseña', err);
        alert("Ocurrió un error al enviar la reseña.");
        this.enviandoResena = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- VOTOS ---
  votarResena(resena: any, esMeGusta: boolean) {
    if (!this.usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    if (resena.id_usuario === this.usuarioId) return;

    this.resenasServicio.votarResena(resena.id, this.usuarioId, esMeGusta).subscribe({
      next: (data) => {
        resena.meGustas = data.meGustas;
        resena.noMeGustas = data.noMeGustas;
        resena.votoUsuarioActual = data.votoUsuarioActual;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al votar reseña', err)
    });
  }
}
