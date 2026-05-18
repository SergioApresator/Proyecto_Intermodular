import { Component, OnInit, inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Usuarios } from '../../services/usuarios';
import { ResenasService } from '../../services/resenas';
import { Videojuegos } from '../../services/videojuegos';
import { Footer } from '../footer/footer';
import { ConfirmModal } from '../confirm-modal/confirm-modal.component';

import { forkJoin, of, Subject } from 'rxjs';

import { catchError, map, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmModal],


  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bannerInput') bannerInput!: ElementRef<HTMLInputElement>;

  constructor(
    private usuariosServicio: Usuarios,
    private resenasServicio: ResenasService,
    private videojuegosServicio: Videojuegos,
    private cdr: ChangeDetectorRef
  ) { }

  usuario: any = null;
  cargando: boolean = true;
  error: string = '';
  fieldErrors: { [key: string]: string } = {}; // Errores por campo

  // Reseñas
  resenas: any[] = [];
  cargandoResenas: boolean = true;

  listas: any[] = [];
  cargandoListas: boolean = true;
  listaEnEdicion: string | null = null;

  // Búsqueda para añadir a listas
  mostrarModalBusqueda: boolean = false;
  listaDestino: string | null = null;
  queryBusqueda: string = '';
  resultadosBusqueda: any[] = [];
  buscando: boolean = false;
  private searchSubject = new Subject<string>();

  // Modal de confirmación genérico
  modalConfirmacionVisible: boolean = false;
  modalConfirmacionConfig = {
    titulo: 'CONFIRMAR',
    mensaje: '¿Estás seguro?',
    tipo: 'warning' as 'danger' | 'warning' | 'info',
    accion: () => { }
  };


  get favoritosCount(): number {
    const favList = this.listas.find(l => l.nombre === 'Favoritos');
    return favList ? favList.juegos.length : 0;
  }

  pestanaActual: string = 'resumen';

  cambiarPestana(id: string) {
    this.pestanaActual = id;
    this.listaEnEdicion = null;
    if (id === 'ajustes') {
      this.iniciarEdicion();
    }
    this.cdr.detectChanges();
  }

  volver() {
    this.router.navigate(['/']);
  }

  editando: boolean = false;
  guardando: boolean = false;
  formEdicion: any = {};
  mensajeExito: string = '';

  archivoSeleccionado: File | null = null;
  previewFoto: string | null = null;
  subiendoFoto: boolean = false;
  errorFoto: string = '';

  archivoBannerSeleccionado: File | null = null;
  previewBanner: string | null = null;
  subiendoBanner: boolean = false;
  errorBanner: string = '';

  // Patrones de validación estrictos
  private readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  private readonly USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
  private readonly NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s]{2,40}$/;

  ngOnInit() {
    const id = typeof window !== 'undefined' ? localStorage.getItem('usuarioId') : null;
    if (!id) {
      this.router.navigate(['/login']);
      return;
    }
    const idNum = Number(id);
    this.cargarPerfil(idNum);
    this.cargarResenas(idNum);
    this.cargarTodasLasListas(idNum);

    // Configurar búsqueda reactiva mejorada
    this.searchSubject.pipe(
      tap(() => {
        this.buscando = true;
        this.cdr.detectChanges();
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          this.buscando = false;
          this.cdr.detectChanges();
          return of({ results: [] });
        }
        return this.videojuegosServicio.buscarJuegos(query);
      })
    ).subscribe({
      next: (res: any) => {
        this.resultadosBusqueda = res.results || [];
        this.buscando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.buscando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarPerfil(id: number) {
    this.cargando = true;
    this.usuariosServicio.getUsuarioById(id).subscribe({
      next: (data: any) => {
        this.usuario = data;
        const banner = data.banner_url || data.bannerUrl;
        if (banner) localStorage.setItem('banner_url', banner);
        const foto = data.foto_url || data.fotoUrl;
        if (foto) localStorage.setItem('foto_url', foto);
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
    this.cargandoResenas = true;
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

  eliminarResena(idResena: number) {
    this.mostrarConfirmacion(
      'ELIMINAR RESEÑA',
      '¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer.',
      'danger',
      () => {
        this.resenasServicio.eliminarResena(idResena).subscribe({
          next: () => {
            this.resenas = this.resenas.filter(r => r.id !== idResena);
            this.mensajeExito = 'Reseña eliminada correctamente.';
            this.cdr.detectChanges();
            setTimeout(() => (this.mensajeExito = ''), 3000);
          },
          error: () => {
            this.error = 'No se pudo eliminar la reseña.';
            this.cdr.detectChanges();
          }
        });
      }
    );
  }


  cargarTodasLasListas(id: number) {
    this.cargandoListas = true;
    this.usuariosServicio.getListasUsuario(id).subscribe({
      next: (listasBrutas: any[]) => {
        if (listasBrutas.length === 0) {
          this.listas = [];
          this.cargandoListas = false;
          this.cdr.detectChanges();
          return;
        }

        const grupos: { [key: string]: { gameId: number, entryId: number }[] } = {};
        listasBrutas.forEach(item => {
          if (!grupos[item.nombre]) grupos[item.nombre] = [];
          grupos[item.nombre].push({ gameId: item.id_videojuego, entryId: item.id });
        });

        const nombresListas = Object.keys(grupos);
        const peticionesListas = nombresListas.map(nombre => {
          const items = grupos[nombre];
          const peticionesJuegos = items.map(it =>
            this.videojuegosServicio.getJuegoDetalles(it.gameId.toString()).pipe(
              map(j => (j ? { ...j, entryId: it.entryId } : null)),
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

  toggleEditarLista(nombre: string) {
    if (this.listaEnEdicion === nombre) {
      this.listaEnEdicion = null;
    } else {
      this.listaEnEdicion = nombre;
    }
    this.cdr.detectChanges();
  }

  eliminarDeLista(entryId: number, nombreLista: string) {
    this.usuariosServicio.eliminarDeLista(entryId).subscribe({
      next: () => {
        const lista = this.listas.find(l => l.nombre === nombreLista);
        if (lista) {
          lista.juegos = lista.juegos.filter((j: any) => j.entryId !== entryId);
          if (lista.juegos.length === 0 && nombreLista !== 'Favoritos' && nombreLista !== 'Videojuegos Pendientes') {
            this.listas = this.listas.filter(l => l.nombre !== nombreLista);
            this.listaEnEdicion = null;
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {
        alert('No se pudo eliminar el juego de la lista.');
      }
    });
  }

  // --- BUSQUEDA Y ADICION ---
  abrirModalBusqueda(nombreLista: string) {
    this.listaDestino = nombreLista;
    this.mostrarModalBusqueda = true;
    this.queryBusqueda = '';
    this.resultadosBusqueda = [];
    this.buscando = false;
    this.cdr.detectChanges();
  }

  cerrarModalBusqueda() {
    this.mostrarModalBusqueda = false;
    this.listaDestino = null;
    this.cdr.detectChanges();
  }

  onSearchChange() {
    this.searchSubject.next(this.queryBusqueda);
  }

  agregarJuegoALista(juego: any) {
    const id = typeof window !== 'undefined' ? localStorage.getItem('usuarioId') : null;
    if (!this.listaDestino || !id) return;
    const uid = Number(id);

    const lista = this.listas.find(l => l.nombre === this.listaDestino);
    if (lista && lista.juegos.some((j: any) => j.id === juego.id)) {
      alert('Este juego ya está en la lista.');
      return;
    }

    const payload = {
      nombre: this.listaDestino,
      id_videojuego: juego.id,
      id_usuario: uid
    };

    this.usuariosServicio.agregarALista(payload).subscribe({
      next: (nuevaEntrada: any) => {
        if (lista) {
          lista.juegos.push({ ...juego, entryId: nuevaEntrada.id });
        }
        this.cerrarModalBusqueda();
        this.mensajeExito = `¡${juego.name} añadido a ${this.listaDestino}!`;
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        alert('Error al añadir el juego a la lista.');
      }
    });
  }

  abrirSelectorFoto() { this.fileInput.nativeElement.click(); }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.errorFoto = '';
    if (!file.type.startsWith('image/')) {
      this.errorFoto = 'Solo se permiten imágenes (JPG, PNG, GIF, WebP…)';
      this.cdr.detectChanges();
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      this.errorFoto = 'La imagen no puede superar los 20 MB.';
      this.cdr.detectChanges();
      return;
    }
    this.archivoSeleccionado = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewFoto = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  subirFoto() {
    if (!this.archivoSeleccionado || !this.usuario?.id) return;
    this.subiendoFoto = true;
    this.usuariosServicio.subirFotoPerfil(this.usuario.id, this.archivoSeleccionado).subscribe({
      next: (data: any) => {
        this.usuario = data;
        const foto = data.foto_url || data.fotoUrl;
        if (foto) localStorage.setItem('foto_url', foto);
        // Sincronizar con el formulario de edición
        if (this.formEdicion) this.formEdicion.foto_url = foto;

        this.previewFoto = null;
        this.archivoSeleccionado = null;
        this.subiendoFoto = false;
        this.mensajeExito = '¡Foto de perfil actualizada!';
        this.usuariosServicio.notificarCambioPerfil();
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        this.errorFoto = 'Error al subir la imagen.';
        this.subiendoFoto = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetearFoto() {
    if (!this.usuario?.id) return;

    this.mostrarConfirmacion(
      'ELIMINAR FOTO',
      '¿Estás seguro de que deseas eliminar tu foto de perfil?',
      'danger',
      () => {
        this.usuariosServicio.resetearFotoPerfil(this.usuario.id).subscribe({
          next: (data: any) => {
            this.usuario = data;
            localStorage.removeItem('foto_url');
            if (this.formEdicion) this.formEdicion.foto_url = '';
            this.previewFoto = null;
            this.archivoSeleccionado = null;
            this.mensajeExito = 'Foto de perfil eliminada.';
            this.usuariosServicio.notificarCambioPerfil();
            this.cdr.detectChanges();
            setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
          },
          error: () => {
            this.errorFoto = 'Error al eliminar la foto.';
            this.cdr.detectChanges();
          }
        });
      }
    );
  }


  cancelarFoto() {
    this.archivoSeleccionado = null;
    this.previewFoto = null;
    this.errorFoto = '';
    this.fileInput.nativeElement.value = '';
    this.cdr.detectChanges();
  }

  abrirSelectorBanner() { this.bannerInput.nativeElement.click(); }

  onBannerSeleccionado(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  this.errorBanner = '';
  if (!file.type.startsWith('image/')) {
    this.errorBanner = 'Solo se permiten imágenes (JPG, PNG, GIF, WebP…)';
    this.cdr.detectChanges();
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    this.errorBanner = 'La imagen no puede superar los 5 MB.';
    this.cdr.detectChanges();
    return;
  }
  this.archivoBannerSeleccionado = file;
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.previewBanner = e.target.result;
    this.cdr.detectChanges();
  };
  reader.readAsDataURL(file);
}

  // Sube el banner de portada del perfil al backend y avisa a la Navbar para actualizarla al vuelo
  subirBanner() {
    if (!this.archivoBannerSeleccionado || !this.usuario?.id) return;
    this.subiendoBanner = true;
    this.usuariosServicio.subirBanner(this.usuario.id, this.archivoBannerSeleccionado).subscribe({
      next: (data: any) => {
        this.usuario = data;
        const banner = data.banner_url || data.bannerUrl;
        if (banner) {
          this.usuario.banner_url = banner;
          localStorage.setItem('banner_url', banner);
        }
        this.previewBanner = null;
        this.archivoBannerSeleccionado = null;
        this.subiendoBanner = false;
        this.mensajeExito = '¡Banner actualizado!';
        this.usuariosServicio.notificarCambioPerfil(); // Avisa a los componentes suscritos (como app.component)
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        this.errorBanner = 'Error al subir el banner.';
        this.subiendoBanner = false;
        this.cdr.detectChanges();
      }
    });
  }

cancelarBanner() {
  this.archivoBannerSeleccionado = null;
  this.previewBanner = null;
  this.errorBanner = '';
  this.bannerInput.nativeElement.value = '';
  this.cdr.detectChanges();
}

  iniciarEdicion() {
    this.formEdicion = {
      nombre: this.usuario.nombre || '',
      apellidos: this.usuario.apellidos || '',
      username: this.usuario.username || '',
      email: this.usuario.email || '',
      biografia: this.usuario.biografia || '',
      foto_url: this.usuario.foto_url || '',
    };
    this.editando = true;
    this.mensajeExito = '';
    this.error = '';
    this.fieldErrors = {};
    this.cdr.detectChanges();
  }

  guardarCambios() {
    this.fieldErrors = {};
    this.error = '';

    // 1. Limpieza de datos (Trimming)
    const nombre = this.formEdicion.nombre?.trim();
    const apellidos = this.formEdicion.apellidos?.trim();
    const username = this.formEdicion.username?.trim();
    const email = this.formEdicion.email?.trim()?.toLowerCase();

    // 2. Validaciones estrictas con asignación de errores por campo
    let hasErrors = false;

    if (!nombre) {
      this.fieldErrors['nombre'] = 'Este campo es obligatorio.';
      hasErrors = true;
    } else if (!this.NAME_PATTERN.test(nombre)) {
      this.fieldErrors['nombre'] = 'El nombre contiene caracteres no válidos.';
      hasErrors = true;
    }

    if (apellidos && !this.NAME_PATTERN.test(apellidos)) {
      this.fieldErrors['apellidos'] = 'Los apellidos contienen caracteres no válidos.';
      hasErrors = true;
    }

    if (!username) {
      this.fieldErrors['username'] = 'Este campo es obligatorio.';
      hasErrors = true;
    } else if (!this.USERNAME_PATTERN.test(username)) {
      this.fieldErrors['username'] = 'Solo letras, números y guiones bajos.';
      hasErrors = true;
    }

    if (!email) {
      this.fieldErrors['email'] = 'Este campo es obligatorio.';
      hasErrors = true;
    } else if (!this.EMAIL_PATTERN.test(email)) {
      this.fieldErrors['email'] = 'Formato de correo no válido (ej: .com, .es).';
      hasErrors = true;
    }

    if (hasErrors) {
      this.error = 'Por favor, corrige los errores en el formulario.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;

    // Preparamos payload limpio
    const payload = {
      ...this.formEdicion,
      nombre,
      apellidos,
      username,
      email
    };

    this.usuariosServicio.actualizarUsuario(this.usuario.id, payload).subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.guardando = false;
        this.editando = false;
        this.mensajeExito = '¡Perfil actualizado con éxito!';
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: (err: any) => {
        this.guardando = false;
        this.error = 'Error al guardar los cambios. Es posible que el nombre de usuario o email ya estén en uso.';
        this.cdr.detectChanges();
      }
    });
  }

  getStars(puntuacion: number): number[] { return Array(puntuacion).fill(0); }
  getInitials(): string { return this.usuario?.username ? this.usuario.username.charAt(0).toUpperCase() : '?'; }

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

  resetearBanner() {
    if (!this.usuario?.id) return;
    this.mostrarConfirmacion(
        'ELIMINAR BANNER',
        '¿Estás seguro de que deseas eliminar tu banner de perfil?',
        'danger',
        () => {
            this.usuariosServicio.resetearBanner(this.usuario.id).subscribe({
                next: (data: any) => {
                    this.usuario = data;
                    this.usuario.banner_url = null;
                    localStorage.removeItem('banner_url');
                    this.mensajeExito = 'Banner eliminado.';
                    this.usuariosServicio.notificarCambioPerfil();
                    this.cdr.detectChanges();
                    setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
                },
                error: () => {
                    this.errorBanner = 'Error al eliminar el banner.';
                    this.cdr.detectChanges();
                }
            });
        }
    );
}
}

