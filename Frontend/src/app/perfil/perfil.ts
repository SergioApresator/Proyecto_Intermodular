import { Component, OnInit, inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Usuarios } from '../usuarios';
import { ResenasService } from '../resenas';
import { Videojuegos } from '../videojuegos';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private usuariosServicio: Usuarios,
    private resenasServicio: ResenasService,
    private videojuegosServicio: Videojuegos,
    private cdr: ChangeDetectorRef
  ) {}

  usuario: any = null;
  cargando: boolean = true;
  error: string = '';

  // Reseñas
  resenas: any[] = [];
  cargandoResenas: boolean = true;

  // Edición
  editando: boolean = false;
  guardando: boolean = false;
  formEdicion: any = {};
  mensajeExito: string = '';

  // Foto de perfil
  archivoSeleccionado: File | null = null;
  previewFoto: string | null = null;
  subiendoFoto: boolean = false;
  errorFoto: string = '';

  ngOnInit() {
    const id = typeof window !== 'undefined' ? localStorage.getItem('usuarioId') : null;
    if (!id) {
      this.router.navigate(['/login']);
      return;
    }
    const idNum = Number(id);
    this.cargarPerfil(idNum);
    this.cargarResenas(idNum);
  }

  cargarPerfil(id: number) {
    this.cargando = true;
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

  // ─── Foto de perfil ───

  abrirSelectorFoto() {
    this.fileInput.nativeElement.click();
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.errorFoto = '';

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      this.errorFoto = 'Solo se permiten imágenes (JPG, PNG, GIF, WebP…)';
      this.cdr.detectChanges();
      return;
    }

    // Validar tamaño (5 MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      this.errorFoto = 'La imagen no puede superar los 5 MB.';
      this.cdr.detectChanges();
      return;
    }

    this.archivoSeleccionado = file;

    // Generar previsualización local
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
    this.errorFoto = '';
    this.usuariosServicio.subirFotoPerfil(this.usuario.id, this.archivoSeleccionado).subscribe({
      next: (data: any) => {
        this.usuario = data;
        // Actualizar localStorage y navbar
        if (data.foto_url) localStorage.setItem('foto_url', data.foto_url);
        this.previewFoto = null;
        this.archivoSeleccionado = null;
        this.subiendoFoto = false;
        this.mensajeExito = '¡Foto de perfil actualizada!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.mensajeExito = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: () => {
        this.errorFoto = 'Error al subir la imagen. Inténtalo de nuevo.';
        this.subiendoFoto = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelarFoto() {
    this.archivoSeleccionado = null;
    this.previewFoto = null;
    this.errorFoto = '';
    this.fileInput.nativeElement.value = '';
    this.cdr.detectChanges();
  }

  // ─── Edición de perfil ───

  iniciarEdicion() {
    this.formEdicion = {
      nombre: this.usuario.nombre || '',
      apellidos: this.usuario.apellidos || '',
      username: this.usuario.username || '',
      email: this.usuario.email || '',
      biografia: this.usuario.biografia || '',
    };
    this.editando = true;
    this.mensajeExito = '';
    this.cdr.detectChanges();
  }

  cancelarEdicion() {
    this.editando = false;
    this.mensajeExito = '';
    this.cdr.detectChanges();
  }

  guardarCambios() {
    this.guardando = true;
    this.usuariosServicio.actualizarUsuario(this.usuario.id, this.formEdicion).subscribe({
      next: (data: any) => {
        this.usuario = data;
        if (data.username) localStorage.setItem('username', data.username);
        if (data.foto_url) localStorage.setItem('foto_url', data.foto_url);
        this.guardando = false;
        this.editando = false;
        this.mensajeExito = '¡Perfil actualizado correctamente!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.mensajeExito = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: () => {
        this.guardando = false;
        this.error = 'Error al guardar los cambios.';
        this.cdr.detectChanges();
      }
    });
  }

  getStars(puntuacion: number): number[] {
    return Array(puntuacion).fill(0);
  }

  getEmptyStars(puntuacion: number): number[] {
    return Array(5 - puntuacion).fill(0);
  }

  getInitials(): string {
    if (this.usuario?.username) {
      return this.usuario.username.charAt(0).toUpperCase();
    }
    return '?';
  }
}
