// Modelo de reseña tal como lo devuelve la API del backend
// Incluye campos añadidos en el frontend (nombreJuego, imagenJuego) para enriquecer los datos
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
  // Votos — la API puede devolver en snake_case o camelCase
  meGustas?: number;
  me_gustas?: number;
  noMeGustas?: number;
  no_me_gustas?: number;
  votoUsuarioActual?: boolean | null;
  // Campos enriquecidos en el frontend tras cruzar con la API de RAWG
  nombreJuego?: string;
  imagenJuego?: string;
  // Campos de UI gestionados localmente en juego-detalle
  respuestas?: any[];
  mostrarRespuestas?: boolean;
  nuevaRespuestaTexto?: string;
  respuestaPadreSeleccionada?: any | null;
}
