// Modelo de usuario tal como lo devuelve la API del backend (Spring Boot)
// Los campos foto_url/fotoUrl y banner_url/bannerUrl existen en ambas formas
// porque Jackson puede serializar en snake_case o camelCase según la versión del endpoint
export interface Usuario {
  id: number;
  nombre: string;
  apellidos?: string;
  username: string;
  email: string;
  password?: string;
  biografia?: string;
  // La API puede devolver cualquiera de las dos formas según el endpoint
  foto_url?: string;
  fotoUrl?: string;
  banner_url?: string;
  bannerUrl?: string;
  esAdmin: boolean;
  baneado: boolean;
}
