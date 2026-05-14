import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Usuarios } from '../usuarios';

@Component({
  selector: 'app-buscar-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './buscar-usuarios.html',
  styleUrl: './buscar-usuarios.css',
})
export class BuscarUsuarios {
  constructor(private usuariosServicio: Usuarios, private cdr: ChangeDetectorRef) {}

  terminoBusqueda: string = '';
  resultados: any[] = [];
  buscando: boolean = false;
  busquedaRealizada: boolean = false;

  buscar() {
    if (this.terminoBusqueda.trim().length === 0) return;

    this.buscando = true;
    this.busquedaRealizada = true;
    const miId = localStorage.getItem('usuarioId');

    this.usuariosServicio.buscarUsuarios(this.terminoBusqueda).subscribe({
      next: (respuesta: any) => {
        //Filtramos el usuario logueado de los resultados
        this.resultados = respuesta.filter((u: any) => u.id.toString() !== miId);
        this.buscando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al buscar usuarios', err);
        this.buscando = false;
      }
    });
  }
}
