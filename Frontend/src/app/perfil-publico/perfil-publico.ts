import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
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
  styleUrl: './perfil-publico.css',
})

export class PerfilPublico implements OnInit {

  constructor(
    private usuariosServicio: Usuarios,
    private resenasServicio: ResenasService,
    private videojuegosServicio: Videojuegos,
    private ruta: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  usuario: any = null;
  cargando: boolean = true;
  error: string = '';
  resenas: any[] = [];
  cargandoResenas: boolean = true;
  listas: any[] = [];
  cargandoListas: boolean = true;

  get favoritosCount(): number {
    const favList = this.listas.find(l => l.nombre === 'Favoritos');
    return favList ? favList.juegos.length : 0;
  }

  ngOnInit() {
    //Obtenemos el id del usuario de la URL
    const id = Number(this.ruta.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Usuario no encontrado.';
      this.cargando = false;
      return;
    }
    this.cargarPerfil(id);
    this.cargarResenas(id);
    this.cargarListas(id);
  }

  cargarPerfil(id: number) {
    this.usuariosServicio.getUsuarioById(id).subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar el perfil.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarResenas(id: number) {
    this.resenasServicio.getResenasPorUsuario(id).subscribe({
      next: (resenas: any[]) => {
        if (!resenas || resenas.length === 0) {
          this.resenas = [];
          this.cargandoResenas = false;
          this.cdr.detectChanges();
          return;
        }

        const peticiones = resenas.map((resena: any) =>
          this.videojuegosServicio.getJuegoDetalles(resena.id_videojuego.toString()).pipe(
            map((juego: any) => ({
              ...resena,
              nombreJuego: juego.name,
              imagenJuego: juego.background_image,
            })),
            catchError(() => of({
              ...resena,
              nombreJuego: `Juego #${resena.id_videojuego}`,
              imagenJuego: null,
            }))
          )
        );

        forkJoin(peticiones).subscribe({
          next: (resenasEnriquecidas: any) => {
            this.resenas = resenasEnriquecidas.sort((a: any, b: any) =>
              new Date(b.fechaResena).getTime() - new Date(a.fechaResena).getTime()
            );
            this.cargandoResenas = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.resenas = resenas;
            this.cargandoResenas = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.cargandoResenas = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarListas(id: number) {
    this.usuariosServicio.getListasUsuario(id).subscribe({
      next: (listasBrutas: any[]) => {
        if (listasBrutas.length === 0) {
          this.listas = [];
          this.cargandoListas = false;
          this.cdr.detectChanges();
          return;
        }

        const grupos: { [key: string]: number[] } = {};
        listasBrutas.forEach(item => {
          if (!grupos[item.nombre]) grupos[item.nombre] = [];
          grupos[item.nombre].push(item.id_videojuego);
        });

        const nombresListas = Object.keys(grupos);
        const peticionesListas = nombresListas.map(nombre => {
          const ids = grupos[nombre];
          const peticionesJuegos = ids.map(gameId =>
            this.videojuegosServicio.getJuegoDetalles(gameId.toString()).pipe(
              catchError(() => of(null))
            )
          );
          return forkJoin(peticionesJuegos).pipe(
            map(juegos => ({
              nombre,
              juegos: juegos.filter(j => j !== null)
            }))
          );
        });

        forkJoin(peticionesListas).subscribe({
          next: (resultado: any[]) => {
            this.listas = resultado.sort((a, b) => {
              if (a.nombre === 'Favoritos') return -1;
              if (b.nombre === 'Favoritos') return 1;
              return a.nombre.localeCompare(b.nombre);
            });
            this.cargandoListas = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.cargandoListas = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.cargandoListas = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStars(puntuacion: number): number[] { return Array(puntuacion).fill(0); }
  getEmptyStars(puntuacion: number): number[] { return Array(5 - puntuacion).fill(0); }
  getInitials(): string { return this.usuario?.username ? this.usuario.username.charAt(0).toUpperCase() : '?'; }
}