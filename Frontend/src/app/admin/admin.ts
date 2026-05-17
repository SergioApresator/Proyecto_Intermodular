import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResenasService } from '../resenas';
import { Usuarios } from '../usuarios';
import { ConfirmModal } from '../confirm-modal/confirm-modal.component';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModal],

  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {

  resenasARevisar: any[] = [];

  // ===== USUARIOS =====
  pestanaActiva: 'moderacion' | 'usuarios' = 'moderacion';
  terminoBusqueda: string = '';
  resultadosUsuarios: any[] = [];
  buscando: boolean = false;
  busquedaRealizada: boolean = false;
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  
  // Modal de confirmación
  modalConfirmacionVisible: boolean = false;
  modalConfirmacionConfig = {
    titulo: 'CONFIRMAR',
    mensaje: '¿Estás seguro?',
    tipo: 'warning' as 'danger' | 'warning' | 'info',
    accion: () => { }
  };


  private router = inject(Router);

  constructor(
    private resenasServicio: ResenasService,
    private usuariosServicio: Usuarios,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Protección de la ruta para usuarios no administradores
    if (typeof window !== 'undefined' && localStorage.getItem('esAdmin') !== 'true') {
      this.router.navigate(['/inicial']);
      return;
    }

    this.cargarResenas();
  }

  cambiarPestana(pestana: 'moderacion' | 'usuarios') {
    this.pestanaActiva = pestana;
  }

  // ===== MODERACIÓN =====

  cargarResenas() {
    this.resenasServicio.getResenasARevisar().subscribe({
      next: (resenas: any[]) => {
        this.resenasARevisar = resenas;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
        this.cdr.detectChanges();
      }
    });
  }

  marcarComoSpoiler(id: number) {
    this.mostrarConfirmacion(
      'MARCAR COMO SPOILER',
      '¿Estás seguro de que deseas marcar esta reseña como spoiler? Esto ocultará el texto del contenido por defecto para los usuarios de la plataforma.',
      'warning',
      () => {
        this.resenasServicio.getResenaPorId(id).subscribe({
          next: (resenaData) => {
            resenaData.tieneSpoiler = true;
            this.resenasServicio.updateResena(id, resenaData).subscribe({
              next: () => {
                this.resenasARevisar = this.resenasARevisar.filter(r => r.id !== id);
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error al actualizar spoiler en servidor:', err);
                this.resenasARevisar = this.resenasARevisar.filter(r => r.id !== id);
                this.cdr.detectChanges();
              }
            });
          },
          error: (err) => {
            console.error('Error al obtener la reseña para actualizarla:', err);
          }
        });
      }
    );
  }

  validarResena(id: number) {
    this.mostrarConfirmacion(
      'VALIDAR RESEÑA',
      '¿Estás seguro de que deseas VALIDAR esta reseña? Se marcará como aprobada y será visible para todos los usuarios de la plataforma.',
      'info',
      () => {
        this.resenasServicio.getResenaPorId(id).subscribe({
          next: (resenaData) => {
            resenaData.revisada = true;
            this.resenasServicio.updateResena(id, resenaData).subscribe({
              next: () => {
                this.resenasARevisar = this.resenasARevisar.filter(r => r.id !== id);
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error al actualizar revisión en servidor:', err);
                this.resenasARevisar = this.resenasARevisar.filter(r => r.id !== id);
                this.cdr.detectChanges();
              }
            });
          },
          error: (err) => {
            console.error('Error al obtener la reseña para validarla:', err);
          }
        });
      }
    );
  }

  eliminarResena(id: number) {
    this.mostrarConfirmacion(
      'ELIMINAR RESEÑA',
      '¿Estás seguro de que deseas ELIMINAR esta reseña permanentemente por contenido inapropiado? Esta acción no se puede deshacer.',
      'danger',
      () => {
        this.resenasServicio.eliminarResena(id).subscribe({
          next: () => {
            this.resenasARevisar = this.resenasARevisar.filter(r => r.id !== id);
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al eliminar la reseña:', err);
          }
        });
      }
    );
  }

  mostrarConfirmacion(titulo: string, mensaje: string, tipo: 'danger' | 'warning' | 'info', accion: () => void) {
    this.modalConfirmacionConfig = { titulo, mensaje, tipo, accion };
    this.modalConfirmacionVisible = true;
  }

  confirmarModal() {
    this.modalConfirmacionConfig.accion();
    this.modalConfirmacionVisible = false;
  }

  cancelarModal() {
    this.modalConfirmacionVisible = false;
  }

  // ===== USUARIOS =====

  buscarUsuarios() {
    if (this.terminoBusqueda.trim().length === 0) {
      this.resultadosUsuarios = [];
      this.busquedaRealizada = false;
      return;
    }

    this.buscando = true;
    this.busquedaRealizada = true;
    this.paginaActual = 1;

    this.usuariosServicio.buscarUsuarios(this.terminoBusqueda).subscribe({
      next: (respuesta: any) => {
        this.resultadosUsuarios = respuesta;
        this.buscando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al buscar usuarios', err);
        this.buscando = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleBaneo(usuario: any) {
    const accion = usuario.baneado ? 'DESBANEAR' : 'BANEAR';
    const tipo = usuario.baneado ? 'info' : 'danger';
    const mensaje = usuario.baneado 
      ? `¿Estás seguro de que deseas desbanear al usuario "${usuario.username}"? Podrá volver a acceder al sistema y publicar contenido.` 
      : `¿Estás seguro de que deseas BANEAR al usuario "${usuario.username}"? Se le denegará el acceso al sistema de forma inmediata.`;

    this.mostrarConfirmacion(
      `${accion} USUARIO`,
      mensaje,
      tipo,
      () => {
        const nuevoBaneado = !usuario.baneado;

        // Obtenemos el usuario completo y luego actualizamos solo el campo baneado
        this.usuariosServicio.getUsuarioById(usuario.id).subscribe({
          next: (usuarioCompleto: any) => {
            const usuarioActualizado = { ...usuarioCompleto, baneado: nuevoBaneado };

            this.usuariosServicio.actualizarUsuario(usuario.id, usuarioActualizado).subscribe({
              next: (respuesta: any) => {
                usuario.baneado = respuesta.baneado;
                this.cdr.detectChanges();
              },
              error: (err: any) => {
                console.error('Error al actualizar el usuario:', err);
                alert('Hubo un error al intentar actualizar el usuario.');
              }
            });
          },
          error: (err: any) => {
            console.error('Error al obtener el usuario:', err);
            alert('Hubo un error al obtener los datos del usuario.');
          }
        });
      }
    );
  }

  get usuariosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.resultadosUsuarios.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.resultadosUsuarios.length / this.elementosPorPagina);
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cdr.detectChanges();
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cdr.detectChanges();
    }
  }

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cdr.detectChanges();
    }
  }
}
