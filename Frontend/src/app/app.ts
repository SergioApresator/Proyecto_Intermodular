import { Component, signal, inject, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  private router = inject(Router);

  mostrarBuscador: boolean = false;
  terminoBusqueda: string = '';

  // Auth state
  estaLogueado: boolean = false;
  username: string = '';
  fotoUrl: string = '';
  mostrarDropdown: boolean = false;

  ngOnInit() {
    this.actualizarEstadoAuth();
    // Refresh auth state on every navigation (e.g. after login/logout)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actualizarEstadoAuth();
      }
    });
  }

  actualizarEstadoAuth() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      this.estaLogueado = !!token;
      this.username = localStorage.getItem('username') || '';
      this.fotoUrl = localStorage.getItem('foto_url') || '';
    }
  }

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.mostrarDropdown = false;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('username');
    localStorage.removeItem('foto_url');
    this.estaLogueado = false;
    this.username = '';
    this.fotoUrl = '';
    this.mostrarDropdown = false;
    this.router.navigate(['/inicial']);
  }

  toggleBuscador() {
    this.mostrarBuscador = !this.mostrarBuscador;
    if (!this.mostrarBuscador) {
      this.terminoBusqueda = '';
    }
  }

  buscarGlobal() {
    if (this.terminoBusqueda.trim().length > 0) {
      this.router.navigate(['/inicial'], { queryParams: { q: this.terminoBusqueda } });
      this.mostrarBuscador = false;
      this.terminoBusqueda = '';
    }
  }

  getInitials(): string {
    if (this.username) {
      return this.username.charAt(0).toUpperCase();
    }
    return '?';
  }
}
