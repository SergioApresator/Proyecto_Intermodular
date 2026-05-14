import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Videojuegos } from '../videojuegos';
import { ResenasService } from '../resenas';
import { FormsModule } from '@angular/forms';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-inicial',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Footer],
  templateUrl: './inicial.html',
  styleUrl: './inicial.css',
})
export class Inicial implements OnInit, OnDestroy {
  private videojuegosServicio = inject(Videojuegos);
  private resenasServicio = inject(ResenasService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  // Estados
  juegosDestacados: any[] = [];
  mejoresDelAnio: any[] = [];
  proximosLanzamientos: any[] = [];
  resenasRecientes: any[] = [];

  cargando: boolean = true;
  indiceCarrusel: number = 0;
  intervaloCarrusel: any = null;
  juegoSpotlight: any = null;
  anioActual: number = new Date().getFullYear();

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  ngOnDestroy() {
    if (this.intervaloCarrusel) {
      clearInterval(this.intervaloCarrusel);
    }
  }

  cargarDatosIniciales() {
    this.cargando = true;

    // 1. Juegos Tendencia (para Spotlight)
    this.videojuegosServicio.getTrendingLast30Days().subscribe({
      next: (resp) => {
        const tendencia = resp.results;
        if (tendencia.length > 0) {
          this.juegosDestacados = tendencia.slice(0, 5);
          this.indiceCarrusel = 0;
          this.juegoSpotlight = this.juegosDestacados[0];
          this.iniciarCarrusel();
        }
        this.verificarCargaCompleta();
      },
      error: (err) => {
        console.error(err);
        this.verificarCargaCompleta();
      }
    });

    // 2. Mejores del Año
    this.videojuegosServicio.getBestGamesOfYear().subscribe({
      next: (resp) => {
        this.mejoresDelAnio = resp.results;
        this.verificarCargaCompleta();
      }
    });

    // 3. Próximos Lanzamientos
    this.videojuegosServicio.getProximosLanzamientos().subscribe({
      next: (resp) => {
        this.proximosLanzamientos = resp.results;
        this.verificarCargaCompleta();
      }
    });

    // 4. Reseñas Recientes
    this.resenasServicio.getResenasRecientes().subscribe({
      next: (resp) => {
        this.resenasRecientes = resp;
        this.verificarCargaCompleta();
      }
    });
  }

  private seccionesCargadas = 0;
  verificarCargaCompleta() {
    this.seccionesCargadas++;
    if (this.seccionesCargadas >= 4) {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  // --- LOGICA DEL CARRUSEL ---
  iniciarCarrusel() {
    if (this.intervaloCarrusel) clearInterval(this.intervaloCarrusel);
    
    this.ngZone.runOutsideAngular(() => {
      this.intervaloCarrusel = setInterval(() => {
        this.ngZone.run(() => {
          this.siguienteSlide();
        });
      }, 5000);
    });
  }

  seleccionarSlide(idx: number) {
    this.indiceCarrusel = idx;
    this.juegoSpotlight = this.juegosDestacados[idx];
    this.iniciarCarrusel(); // Reiniciar el contador
    this.cdr.detectChanges();
  }

  siguienteSlide() {
    if (this.juegosDestacados.length > 0) {
      this.indiceCarrusel = (this.indiceCarrusel + 1) % this.juegosDestacados.length;
      this.juegoSpotlight = this.juegosDestacados[this.indiceCarrusel];
      this.cdr.detectChanges();
    }
  }
}