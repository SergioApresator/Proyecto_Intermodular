// Modelo de respuesta (comentario a una reseña) tal como lo devuelve la API del backend
export interface Respuesta {
  id: number;
  mensaje: string;
  id_resena: number;
  id_usuario: number;
  id_respuesta_padre?: number | null;
  meGustas?: number;
  me_gustas?: number;
  noMeGustas?: number;
  no_me_gustas?: number;
  votoUsuarioActual?: boolean | null;
  fechaRespuesta?: string | number[];
  fecha_respuesta?: string | number[];
  nombreUsuario?: string;
  nombre_usuario?: string;
  mensajeResena?: string;
  usuarioResena?: string;
  id_videojuego?: number;
}
