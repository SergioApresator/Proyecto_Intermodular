import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
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

  private router = inject(Router);

  constructor(
    private resenasServicio: ResenasService,
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

  toggleSpoiler(id: number) {
    // Obtenemos los datos completos de la reseña
    this.resenasServicio.getResenaPorId(id).subscribe({
      next: (resenaData) => {
        // Alternamos el estado del spoiler
        resenaData.tieneSpoiler = !resenaData.tieneSpoiler;
        // Actualizamos la reseña completa en base de datos
        this.resenasServicio.updateResena(id, resenaData).subscribe({
          next: () => {
            // Buscamos la reseña en nuestra lista local y la actualizamos
            const index = this.resenasARevisar.findIndex(r => r.id === id);
            if (index !== -1) {
              this.resenasARevisar[index].tieneSpoiler = resenaData.tieneSpoiler;
            }
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

  eliminarResena(id: number) {
    if (confirm('¿Estás seguro de que deseas ELIMINAR esta reseña permanentemente por contenido inapropiado?')) {
      this.resenasServicio.eliminarResena(id).subscribe({
        next: () => {
          this.resenasARevisar = this.resenasARevisar.filter(r => r.id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al eliminar la reseña:', err);
          alert('Hubo un error al intentar eliminar la reseña.');
        }
      });
    }
  }
}

