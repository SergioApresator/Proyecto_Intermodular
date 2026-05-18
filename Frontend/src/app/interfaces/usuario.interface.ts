// Modelo de usuario tal como lo devuelve la API del backend (Spring Boot)

export interface Usuario {
  id: number;
  nombre: string;
  apellidos?: string;
  username: string;
  email: string;
  password?: string;
  biografia?: string;
  foto_url?: string;
  fotoUrl?: string;
  banner_url?: string;
  bannerUrl?: string;
  esAdmin: boolean;
  baneado: boolean;
}
