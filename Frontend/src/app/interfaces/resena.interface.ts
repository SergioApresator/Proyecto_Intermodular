// Modelo de reseña tal como lo devuelve la API del backend

export interface Resena {
  id: number;
  mensaje: string;
  puntuacion: number;
  tieneSpoiler: boolean;
  revisada: boolean;
  fechaResena: string | number[];
  id_usuario: number;
  id_videojuego: number;
  nombreUsuario?: string;
  nombre_usuario?: string;
  nombreVideojuego?: string;
  fotoVideojuego?: string;
  meGustas?: number;
  me_gustas?: number;
  noMeGustas?: number;
  no_me_gustas?: number;
  votoUsuarioActual?: boolean | null;
  nombreJuego?: string;
  imagenJuego?: string;
  respuestas?: any[];
  mostrarRespuestas?: boolean;
  nuevaRespuestaTexto?: string;
  respuestaPadreSeleccionada?: any | null;
}
