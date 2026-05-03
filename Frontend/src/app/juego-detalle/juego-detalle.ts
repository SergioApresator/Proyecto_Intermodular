import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Videojuegos } from '../videojuegos';

@Component({
  selector: 'app-juego-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego-detalle.html',
  styleUrl: './juego-detalle.css'
})
export class JuegoDetalle implements OnInit {
  cargando: boolean = true;
  id: string | null = null;
  juego: any = null;
  descripcionSegura: SafeHtml = '';
  
  // Media Carousel
  mediaItems: any[] = [];
  indiceMediaActual: number = 0;

  get tagsJuego(): any[] {
    return this.juego?.tags ? this.juego.tags.slice(0, 15) : [];
  }

  constructor(
    private route: ActivatedRoute,
    private videojuegosServicio: Videojuegos,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
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
        this.descripcionSegura = this.sanitizer.bypassSecurityTrustHtml(this.juego.description || '');
        
        if (this.juego.background_image) {
          this.mediaItems.push({ tipo: 'imagen', url: this.juego.background_image });
        }
        
        this.cargarMediaExtra(id);
      },
      error: (err) => {
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
        
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  siguienteMedia() {
    if (this.mediaItems.length > 0) {
      this.indiceMediaActual = (this.indiceMediaActual + 1) % this.mediaItems.length;
    }
  }

  anteriorMedia() {
    if (this.mediaItems.length > 0) {
      this.indiceMediaActual = (this.indiceMediaActual - 1 + this.mediaItems.length) % this.mediaItems.length;
    }
  }
}
