import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Usuarios } from '../../services/usuarios';
import { ResenasService } from '../../services/resenas';
import { Videojuegos } from '../../services/videojuegos';
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

  // Método para inicializar el componente leyendo el ID del usuario de la URL y cargando sus datos.
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.cargarDatos(Number(idStr));
      }
    });
  }

  // Método para cambiar la pestaña activa del perfil público (resumen, reseñas, listas).
  cambiarPestana(id: string) {
    this.pestanaActual = id;
    this.cdr.detectChanges();
  }

  // Método para volver a la página de búsqueda de usuarios.
  volver() {
    this.router.navigate(['/buscar-usuarios']);
  }

  // Método para cargar los datos del usuario y lanzar la carga de sus reseñas y listas.
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

  // Método para cargar las reseñas del usuario y enriquecerlas con el nombre e imagen del juego.
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

  // Método para cargar las listas del usuario agrupadas por nombre y con los detalles de cada juego.
  cargarListas(id: number) {
    this.cargandoListas = true;
    this.usuariosServicio.getListasUsuario(id).subscribe({
      next: (listasBrutas: any[]) => {
        if (!listasBrutas || listasBrutas.length === 0) {
          this.listas = [];
          this.cargandoListas = false;
          this.cdr.detectChanges();
          return;
        }

        // Agrupar por nombre de lista
        const grupos: { [key: string]: { gameId: number, entryId: number }[] } = {};
        listasBrutas.forEach(item => {
          if (!grupos[item.nombre]) grupos[item.nombre] = [];
          grupos[item.nombre].push({ gameId: item.id_videojuego, entryId: item.id });
        });

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
            this.listas = res.sort((a, b) => {
              if (a.nombre === 'Favoritos') return -1;
              if (b.nombre === 'Favoritos') return 1;
              return a.nombre.localeCompare(b.nombre);
            });
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



  // Getter para obtener el número de juegos en la lista de Favoritos del usuario público.
  get favoritosCount(): number {
    const favList = this.listas.find(l => l.nombre === 'Favoritos');
    return favList ? favList.juegos.length : 0;
  }

  // Método para obtener la inicial del username del usuario para su avatar.
  getInitials(): string {
    if (!this.usuario || !this.usuario.username) return '?';
    return this.usuario.username.charAt(0).toUpperCase();
  }

  // Método para generar un array de la longitud de la puntuación para renderizar las estrellas llenas.
  getStars(p: number) { return Array(p).fill(0); }
  // Método para generar un array con las estrellas vacías restantes hasta completar 5.
  getEmptyStars(p: number) { return Array(5 - p).fill(0); }
}