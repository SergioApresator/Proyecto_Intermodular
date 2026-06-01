import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResenasService } from '../../services/resenas';
import { Usuarios } from '../../services/usuarios';
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
  miUsuarioId: number | null = null;
  exportandoPdf: boolean = false;
  exportandoCsv: boolean = false;
  exportandoFiltroPdf: boolean = false;
  exportandoFiltroCsv: boolean = false;

  
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

  // Método para inicializar el componente verificando que el usuario es administrador antes de cargar las reseñas.
  ngOnInit() {
    // Protección de la ruta para usuarios no administradores
    if (typeof window !== 'undefined' && localStorage.getItem('esAdmin') !== 'true') {
      this.router.navigate(['/inicial']);
      return;
    }

    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('usuarioId');
      if (storedId) {
        this.miUsuarioId = Number(storedId);
      }
    }

    this.cargarResenas();
    this.buscarUsuarios(); // Carga de usuarios de primeras
  }


  // Método para cambiar entre las pestañas de moderación y gestión de usuarios del panel de administración.
  cambiarPestana(pestana: 'moderacion' | 'usuarios') {
    this.pestanaActiva = pestana;
    if (pestana === 'usuarios' && this.resultadosUsuarios.length === 0) {
      this.buscarUsuarios();
    }
  }

  // ===== MODERACIÓN =====

  // Método para cargar todas las reseñas pendientes de revisión desde el backend.
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

  // Método para alternar el marcado de spoiler de una reseña previa confirmación del administrador.
  marcarComoSpoiler(id: number) {
    const resena = this.resenasARevisar.find(r => r.id === id);
    if (!resena) return;

    const nuevoEstadoSpoiler = !resena.tieneSpoiler;
    const titulo = nuevoEstadoSpoiler ? 'MARCAR COMO SPOILER' : 'QUITAR SPOILER';
    const mensaje = nuevoEstadoSpoiler 
      ? '¿Estás seguro de que deseas marcar esta reseña como spoiler? Esto ocultará el texto del contenido por defecto para los usuarios de la plataforma.'
      : '¿Estás seguro de que deseas quitar el marcado de spoiler a esta reseña?';

    this.mostrarConfirmacion(
      titulo,
      mensaje,
      'warning',
      () => {
        this.resenasServicio.getResenaPorId(id).subscribe({
          next: (resenaData) => {
            resenaData.tieneSpoiler = nuevoEstadoSpoiler;
            this.resenasServicio.updateResena(id, resenaData).subscribe({
              next: () => {
                resena.tieneSpoiler = nuevoEstadoSpoiler;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error al actualizar spoiler en servidor:', err);
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
      '¿Estás seguro de que deseas VALIDAR esta reseña? Se eliminarán todos sus reportes y dejará de aparecer en el panel de moderación.',
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

  // Método para eliminar permanentemente una reseña inapropiada previa confirmación del administrador.
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

  // Método para mostrar el modal de confirmación con el título, mensaje, tipo y acción a ejecutar.
  mostrarConfirmacion(titulo: string, mensaje: string, tipo: 'danger' | 'warning' | 'info', accion: () => void) {
    this.modalConfirmacionConfig = { titulo, mensaje, tipo, accion };
    this.modalConfirmacionVisible = true;
  }

  // Método para ejecutar la acción confirmada y cerrar el modal de confirmación.
  confirmarModal() {
    this.modalConfirmacionConfig.accion();
    this.modalConfirmacionVisible = false;
  }

  // Método para cerrar el modal de confirmación sin ejecutar ninguna acción.
  cancelarModal() {
    this.modalConfirmacionVisible = false;
  }

  // ===== USUARIOS =====

  // Método para buscar usuarios por término e iniciar la paginación de resultados.
  buscarUsuarios() {
    this.buscando = true;
    this.busquedaRealizada = true;
    this.paginaActual = 1;
    const term = this.terminoBusqueda.trim();

    this.usuariosServicio.buscarUsuarios(term).subscribe({
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

  // Método para banear o desbanear a un usuario previa confirmación del administrador.
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

  // Método para alternar el rol de administrador de un usuario previa confirmación
  toggleAdmin(usuario: any) {
    if (this.miUsuarioId && usuario.id === this.miUsuarioId) {
      alert('No puedes quitarte los permisos de administrador a ti mismo.');
      return;
    }

    if (usuario.baneado && !usuario.esAdmin) {
      alert('No se puede hacer administrador a un usuario baneado.');
      return;
    }

    const accion = usuario.esAdmin ? 'QUITAR ADMIN' : 'HACER ADMIN';
    const tipo = usuario.esAdmin ? 'danger' : 'warning';
    const mensaje = usuario.esAdmin 
      ? `¿Estás seguro de que deseas quitar los privilegios de administrador al usuario "${usuario.username}"?` 
      : `¿Estás seguro de que deseas hacer ADMINISTRADOR al usuario "${usuario.username}"? Tendrá acceso completo al panel de control y moderación.`;

    this.mostrarConfirmacion(
      `${accion}`,
      mensaje,
      tipo,
      () => {
        this.usuariosServicio.toggleAdmin(usuario.id).subscribe({
          next: (respuesta: any) => {
            usuario.esAdmin = respuesta.esAdmin;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Error al actualizar rol de administrador:', err);
            const errorMsg = err.error && typeof err.error === 'string' ? err.error : 'Hubo un error al intentar cambiar el rol del usuario.';
            alert(errorMsg);
          }
        });
      }
    );
  }


  // Getter para obtener el subconjunto de usuarios correspondiente a la página actual.
  get usuariosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.resultadosUsuarios.slice(inicio, fin);
  }

  // Getter para calcular el número total de páginas según los resultados encontrados.
  get totalPaginas(): number {
    return Math.ceil(this.resultadosUsuarios.length / this.elementosPorPagina);
  }

  // Método para avanzar a la siguiente página de resultados de usuarios.
  siguientePagina() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cdr.detectChanges();
    }
  }

  // Método para retroceder a la página anterior de resultados de usuarios.
  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cdr.detectChanges();
    }
  }

  // Método para saltar directamente a una página concreta de resultados de usuarios.
  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cdr.detectChanges();
    }
  }

  // Método para eliminar definitivamente un usuario previa confirmación del administrador.
  eliminarUsuario(usuario: any) {
    if (usuario.esAdmin) {
      alert('No puedes eliminar a un usuario administrador.');
      return;
    }

    this.mostrarConfirmacion(
      'ELIMINAR USUARIO',
      `¿Estás seguro de que deseas ELIMINAR permanentemente la cuenta de "${usuario.username}"? Se borrarán de forma definitiva todas sus reseñas, comentarios, listas y notificaciones. Esta acción es irreversible.`,
      'danger',
      () => {
        this.usuariosServicio.eliminarUsuario(usuario.id).subscribe({
          next: () => {
            this.resultadosUsuarios = this.resultadosUsuarios.filter(u => u.id !== usuario.id);
            const maxPaginas = this.totalPaginas;
            if (this.paginaActual > maxPaginas && this.paginaActual > 1) {
              this.paginaActual = maxPaginas;
            }
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Error al eliminar usuario:', err);
            const errorMsg = err.error && typeof err.error === 'string' ? err.error : 'Hubo un error al intentar eliminar el usuario.';
            alert(errorMsg);
          }
        });
      }
    );
  }

  // Descarga e inicia el guardado del archivo
  private triggerDescargaFile(blob: Blob, defaultFilename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  exportarTodosCsv() {
    this.exportandoCsv = true;
    this.usuariosServicio.descargarUsuariosCsv().subscribe({
      next: (blob: Blob) => {
        this.triggerDescargaFile(blob, 'todos_los_usuarios.csv');
        this.exportandoCsv = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al exportar CSV de todos los usuarios:', err);
        alert('Hubo un error al intentar exportar todos los usuarios a CSV.');
        this.exportandoCsv = false;
        this.cdr.detectChanges();
      }
    });
  }

  exportarTodosPdf() {
    this.exportandoPdf = true;
    this.usuariosServicio.descargarUsuariosPdf().subscribe({
      next: (blob: Blob) => {
        this.triggerDescargaFile(blob, 'todos_los_usuarios.pdf');
        this.exportandoPdf = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al exportar PDF de todos los usuarios:', err);
        alert('Hubo un error al intentar exportar todos los usuarios a PDF.');
        this.exportandoPdf = false;
        this.cdr.detectChanges();
      }
    });
  }

  exportarBusquedaCsv() {
    if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
      return;
    }
    this.exportandoFiltroCsv = true;
    const term = this.terminoBusqueda.trim();
    this.usuariosServicio.descargarUsuariosCsv(term).subscribe({
      next: (blob: Blob) => {
        this.triggerDescargaFile(blob, `usuarios_filtrados_${term.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
        this.exportandoFiltroCsv = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al exportar CSV filtrado:', err);
        alert('Hubo un error al intentar exportar la búsqueda a CSV.');
        this.exportandoFiltroCsv = false;
        this.cdr.detectChanges();
      }
    });
  }

  exportarBusquedaPdf() {
    if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
      return;
    }
    this.exportandoFiltroPdf = true;
    const term = this.terminoBusqueda.trim();
    this.usuariosServicio.descargarUsuariosPdf(term).subscribe({
      next: (blob: Blob) => {
        this.triggerDescargaFile(blob, `usuarios_filtrados_${term.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
        this.exportandoFiltroPdf = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al exportar PDF filtrado:', err);
        alert('Hubo un error al intentar exportar la búsqueda a PDF.');
        this.exportandoFiltroPdf = false;
        this.cdr.detectChanges();
      }
    });
  }
}
