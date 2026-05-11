import { Component, signal, inject, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
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
  userId: string = '';
  fotoUrl: string = '';
  bannerUrl: string = '';
  mostrarDropdown: boolean = false;

  // Theme state
  isDarkMode: boolean = false;

  ngOnInit() {
    this.checkTheme();
    this.actualizarEstadoAuth();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actualizarEstadoAuth();
      }
    });
  }

  checkTheme() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  applyTheme() {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  actualizarEstadoAuth() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      this.estaLogueado = !!token;
      this.username = localStorage.getItem('username') || '';
      this.userId = localStorage.getItem('usuarioId') || '';
      this.fotoUrl = localStorage.getItem('foto_url') || '';
      this.bannerUrl = localStorage.getItem('banner_url') || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop';
    }
  }

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-ow')) {
      this.mostrarDropdown = false;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('username');
    localStorage.removeItem('foto_url');
    localStorage.removeItem('banner_url');
    this.estaLogueado = false;
    this.username = '';
    this.userId = '';
    this.fotoUrl = '';
    this.bannerUrl = '';
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
