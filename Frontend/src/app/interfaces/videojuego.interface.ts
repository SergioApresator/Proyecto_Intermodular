// Modelos de la API externa RAWG (https://rawg.io/api)
// Sólo se incluyen los campos que realmente se usan en la aplicación

export interface Genero {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Plataforma {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Screenshot {
  id: number;
  image: string;
}

export interface Videojuego {
  id: number;
  name: string;
  background_image: string | null;
  description?: string;
  description_raw?: string;
  released?: string;
  rating?: number;
  metacritic?: number | null;
  genres?: Genero[];
  tags?: Tag[];
  parent_platforms?: Plataforma[];
}

// Respuesta paginada de la API RAWG para listados de juegos
export interface RawgListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Videojuego[];
}

// Elemento de la lista de usuario (favoritos, pendientes, etc.)
export interface ListaUsuario {
  id: number;
  nombre: string;
  id_videojuego: number;
  id_usuario: number;
}
