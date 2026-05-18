// Modelo de respuesta (comentario a una reseña) tal como lo devuelve la API del backend
export interface Respuesta {
  id: number;
  mensaje: string;
  id_resena: number;
  id_usuario: number;
  id_respuesta_padre?: number | null;
  // Votos — la API puede devolver en snake_case o camelCase
  meGustas?: number;
  me_gustas?: number;
  noMeGustas?: number;
  no_me_gustas?: number;
  votoUsuarioActual?: boolean | null;
  // Fecha — la API puede devolver en snake_case o camelCase
  fechaRespuesta?: string | number[];
  fecha_respuesta?: string | number[];
  // Nombre de usuario — la API puede devolver en snake_case o camelCase
  nombreUsuario?: string;
  nombre_usuario?: string;
  // Campos de cruce enriquecidos en el diario
  mensajeResena?: string;
  usuarioResena?: string;
  id_videojuego?: number;
}
