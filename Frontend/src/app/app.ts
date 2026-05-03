import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  private router = inject(Router);
  
  mostrarBuscador: boolean = false;
  terminoBusqueda: string = '';

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
}
