import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Usuarios } from '../usuarios';
import { ResenasService } from '../resenas';
import { Videojuegos } from '../videojuegos';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-perfil-publico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil-publico.html',
  styleUrl: './perfil-publico.css'
})
export class PerfilPublico implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuariosServicio = inject(Usuarios);
  private resenasServicio = inject(ResenasService);
  private videojuegosServicio = inject(Videojuegos);
  private cdr = inject(ChangeDetectorRef);

  usuario: any = null;
  cargando: boolean = true;
  error: string = '';

  pestanaActual: string = 'resumen';
  
  resenas: any[] = [];
  cargandoResenas: boolean = true;

  listas: any[] = [];
  cargandoListas: boolean = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.cargarDatos(Number(idStr));
      }
    });
  }

  cambiarPestana(id: string) {
    this.pestanaActual = id;
    this.cdr.detectChanges();
  }

  volver() {
    this.router.navigate(['/buscar-usuarios']);
  }

  cargarDatos(id: number) {
    this.cargando = true;
    this.usuariosServicio.getUsuarioById(id).subscribe({
      next: (u) => {
        this.usuario = u;
        this.cargando = false;
        this.cargarResenas(id);
        this.cargarListas(id);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar el perfil del usuario.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarResenas(id: number) {
    this.cargandoResenas = true;
    this.resenasServicio.getResenasPorUsuario(id).subscribe({
      next: (data: any) => {
        const peticiones = data.map((r: any) => 
          this.videojuegosServicio.getJuegoDetalles(r.id_videojuego.toString()).pipe(
            map(juego => ({
              ...r,
              nombreJuego: juego ? juego.name : 'Juego desconocido',
              imagenJuego: juego ? juego.background_image : null
            })),
            catchError(() => of(r))
          )
        );

        if (peticiones.length > 0) {
          forkJoin(peticiones).subscribe((res: any) => {
            this.resenas = res;
            this.cargandoResenas = false;
            this.cdr.detectChanges();
          });
        } else {
          this.resenas = [];
          this.cargandoResenas = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.cargandoResenas = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarListas(id: number) {
    this.cargandoListas = true;
    this.usuariosServicio.getListasUsuario(id).subscribe({
      next: (grupos: any) => {
        const nombresListas = Object.keys(grupos);
        const peticionesListas = nombresListas.map(nombre => {
          const items = grupos[nombre];
          const peticionesJuegos = items.map((it: any) => 
            this.videojuegosServicio.getJuegoDetalles(it.gameId.toString()).pipe(
              map(j => (j ? { ...j, entryId: it.entryId } : null)),
              catchError(() => of(null))
            )
          );
          
          return forkJoin(peticionesJuegos).pipe(
            map((juegos: any) => ({
              nombre,
              juegos: juegos.filter((j: any) => j !== null)
            }))
          );
        });

        if (peticionesListas.length > 0) {
          forkJoin(peticionesListas).subscribe((res: any[]) => {
            this.listas = res;
            this.cargandoListas = false;
            this.cdr.detectChanges();
          });
        } else {
          this.listas = [];
          this.cargandoListas = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.cargandoListas = false;
        this.cdr.detectChanges();
      }
    });
  }


  get favoritosCount(): number {
    const favList = this.listas.find(l => l.nombre === 'Favoritos');
    return favList ? favList.juegos.length : 0;
  }

  getInitials(): string {
    if (!this.usuario || !this.usuario.username) return '?';
    return this.usuario.username.charAt(0).toUpperCase();
  }

  getStars(p: number) { return Array(p).fill(0); }
  getEmptyStars(p: number) { return Array(5 - p).fill(0); }
}