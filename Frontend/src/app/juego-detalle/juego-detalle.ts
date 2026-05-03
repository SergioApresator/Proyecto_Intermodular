import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Videojuegos } from '../videojuegos';
import { Usuarios } from '../usuarios';

@Component({
  selector: 'app-juego-detalle',
  standalone: true,
  imports: [CommonModule],
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

  // Favoritos
  esFavorito: boolean = false;
  listaFavoritoId: number | null = null;
  usuarioId: number | null = null;
  cambiandoFavorito: boolean = false;

  get tagsJuego(): any[] {
    return this.juego?.tags ? this.juego.tags.slice(0, 15) : [];
  }

  constructor(
    private route: ActivatedRoute,
    private videojuegosServicio: Videojuegos,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private usuariosServicio: Usuarios
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
          this.checkFavorito(id);
        }
        
        this.cargarMediaExtra(id);
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

  checkFavorito(gameIdStr: string) {
    if (!this.usuarioId) return;
    const gameId = parseInt(gameIdStr, 10);
    
    this.usuariosServicio.getListasUsuario(this.usuarioId).subscribe({
      next: (listas: any[]) => {
        const fav = listas.find(l => l.nombre === 'Favoritos' && l.id_videojuego === gameId);
        if (fav) {
          this.esFavorito = true;
          this.listaFavoritoId = fav.id;
        } else {
          this.esFavorito = false;
          this.listaFavoritoId = null;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error comprobando favoritos', err)
    });
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

  ngOnDestroy() {
    this.detenerCarruselMedia();
  }

  // --- CAROUSEL SCRUBBING ---
  isScrubbing: boolean = false;

  onScrubStart(event: MouseEvent | TouchEvent, index: number) {
    // Evitar drag nativo
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
      this.iniciarCarruselMedia(); // Reset timer
    }
  }

  anteriorMedia() {
    if (this.mediaItems.length > 0) {
      this.indiceMediaActual = (this.indiceMediaActual - 1 + this.mediaItems.length) % this.mediaItems.length;
      this.iniciarCarruselMedia(); // Reset timer
    }
  }
}
