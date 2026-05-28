import { Component, inject, OnInit, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuarios } from './services/usuarios';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  private router = inject(Router);
  private usuariosServicio = inject(Usuarios);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private socialAuthService = inject(SocialAuthService);

  mostrarBuscador: boolean = false;
  terminoBusqueda: string = '';

  // Estado de autenticación
  estaLogueado: boolean = false;
  esAdmin: boolean = false;
  username: string = '';
  userId: string = '';
  fotoUrl: string = '';
  bannerUrl: string = '';
  mostrarDropdown: boolean = false;

  // Método para inicializar el componente, cargar el estado de autenticación y suscribirse a cambios de ruta y perfil.
  ngOnInit() {
    this.actualizarEstadoAuth();
    // Nos suscribimos a los cambios de ruta para cerrar el menú y refrescar auth
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actualizarEstadoAuth();
      }
    });

    // Escucha actualizaciones reactivas de perfil (foto/banner) para refrescar el menú superior sin recargar página
    this.usuariosServicio.perfilActualizado$.subscribe(() => {
      this.ngZone.run(() => {
        this.actualizarEstadoAuth();
        this.cdr.detectChanges();
      });
    });
  }

  // Sincroniza las variables locales de la sesión del usuario con el almacenamiento en navegador
  actualizarEstadoAuth() {
    this.mostrarDropdown = false;
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      this.estaLogueado = !!token;
      this.username = localStorage.getItem('username') || '';
      this.userId = localStorage.getItem('usuarioId') || '';
      this.fotoUrl = localStorage.getItem('foto_url') || '';
      this.bannerUrl = localStorage.getItem('banner_url') || '';
      this.esAdmin = localStorage.getItem('esAdmin') === 'true';
    }
  }

  // En móvil el avatar de la Navbar despliega el menú de usuario, en escritorio va directo a la edición de perfil
  onAvatarClick(event: MouseEvent) {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      event.preventDefault();
      event.stopPropagation();
      this.mostrarDropdown = !this.mostrarDropdown;
    } else {
      this.router.navigate(['/perfil']);
    }
  }

  // Método para alternar la visibilidad del menú desplegable del usuario.
  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }

  // Cierra el mini menú si hacemos clic en cualquier otro elemento de la pantalla
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-ow')) {
      this.mostrarDropdown = false;
    }
  }

  // Método para cerrar la sesión del usuario eliminando sus datos del localStorage y redirigiendo a la página inicial.
  cerrarSesion() {
    const isOauth = localStorage.getItem('oauthProvider');
    if (isOauth) {
      this.socialAuthService.signOut().catch(() => {});
    }
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('username');
    localStorage.removeItem('foto_url');
    localStorage.removeItem('banner_url');
    localStorage.removeItem('esAdmin');
    localStorage.removeItem('oauthProvider');
    this.estaLogueado = false;
    this.esAdmin = false;
    this.username = '';
    this.userId = '';
    this.fotoUrl = '';
    this.bannerUrl = '';
    this.mostrarDropdown = false;
    this.router.navigate(['/inicial']);
  }

  // Método para mostrar u ocultar el buscador global de la barra de navegación.
  toggleBuscador() {
    this.mostrarBuscador = !this.mostrarBuscador;
    if (!this.mostrarBuscador) {
      this.terminoBusqueda = '';
    }
  }

  // Método para redirigir a la página de búsqueda con el término introducido en la barra de navegación.
  buscarGlobal() {
    if (this.terminoBusqueda.trim().length > 0) {
      this.router.navigate(['/busqueda'], { queryParams: { q: this.terminoBusqueda } });
      this.mostrarBuscador = false;
      this.terminoBusqueda = '';
    }
  }

  // Método para obtener la inicial del nombre de usuario para mostrarla en el avatar de la navbar.
  getInitials(): string {
    if (this.username) {
      return this.username.charAt(0).toUpperCase();
    }
    return '?';
  }
}
