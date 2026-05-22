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

  // Método para marcar una reseña como revisada y aprobada, haciéndola visible en la plataforma.
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
}
