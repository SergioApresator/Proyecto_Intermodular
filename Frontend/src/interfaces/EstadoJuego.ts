interface EstadoJuego {
  id: number;
  id_usuario: number;
  id_videojuego_api: number;
  estado: 'PENDIENTE' | 'FAVORITO' | 'JUGADO';
}