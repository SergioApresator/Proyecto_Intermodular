import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResenasService } from '../resenas';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {

  resenasARevisar: any[] = [];

  constructor(
    private resenasServicio: ResenasService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarResenas();
  }

  cargarResenas() {
    this.resenasServicio.getResenasARevisar().subscribe({
      next: (resenas: any[]) => {
        this.resenasARevisar = resenas;
        this.cdr.detectChanges(); // Forzar actualización de vista
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
        this.cdr.detectChanges();
      }
    });
  }

  marcarComoSpoiler(id: number) {
    if (confirm('¿Estás seguro de marcar esta reseña como spoiler?')) {
      // Obtenemos los datos completos de la reseña
      this.resenasServicio.getResenaPorId(id).subscribe({
        next: (resenaData) => {
          // Cambiamos el estado del spoiler
          resenaData.tieneSpoiler = true;
          // Actualizamos la reseña completa en base de datos
          this.resenasServicio.updateResena(id, resenaData).subscribe({
            next: () => {
              this.resenasARevisar = this.resenasARevisar.filter(r => r.id !== id);
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error al actualizar spoiler en servidor:', err);
              // Fallback visual en caso de que falle
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
  }

  validarResena(id: number) {
    // Obtenemos los datos completos de la reseña
    this.resenasServicio.getResenaPorId(id).subscribe({
      next: (resenaData) => {
        // Cambiamos el estado de revisada a true
        resenaData.revisada = true;
        // Actualizamos la reseña completa en base de datos
        this.resenasServicio.updateResena(id, resenaData).subscribe({
          next: () => {
            this.resenasARevisar = this.resenasARevisar.filter(r => r.id !== id);
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al actualizar revisión en servidor:', err);
            // Fallback visual
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
}

