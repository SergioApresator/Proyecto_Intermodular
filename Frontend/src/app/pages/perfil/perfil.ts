import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {

  // ⚠️ Esto luego vendrá del login (JWT)
  usuarioId: number = 1;

  usuario = {
    username: '',
    bio: ''
  };

  avatarUrl: string = 'assets/avatar-default.png';

  favoritos: EstadoJuego[] = [];
  pendientes: EstadoJuego[] = [];
  resenas: Resena[] = [];

  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;

    this.cargarPerfil();
    this.cargarEstados();
    this.cargarResenas();

    this.loading = false;
  }

  cargarPerfil() {
    this.http.get<Perfil>(`http://localhost:8080/api/perfil/${this.usuarioId}`)
      .subscribe({
        next: (data) => {
          this.usuario.username = data.username || 'Usuario';
          this.usuario.bio = data.bio || '';

          this.avatarUrl = data.avatar && data.avatar.trim() !== ''
            ? data.avatar
            : 'assets/avatar-default.png';
        },
        error: () => {
          this.avatarUrl = 'assets/avatar-default.png';
        }
      });
  }

  cargarEstados() {
    this.http.get<EstadoJuego[]>(`http://localhost:8080/api/estados/usuario/${this.usuarioId}`)
      .subscribe({
        next: (data) => {
          this.favoritos = data.filter(e => e.estado === 'FAVORITO');
          this.pendientes = data.filter(e => e.estado === 'PENDIENTE');
        },
        error: () => {
          this.favoritos = [];
          this.pendientes = [];
        }
      });
  }

  cargarResenas() {
    this.http.get<Resena[]>(`http://localhost:8080/api/resenas/usuario/${this.usuarioId}`)
      .subscribe({
        next: (data) => this.resenas = data,
        error: () => this.resenas = []
      });
  }
}