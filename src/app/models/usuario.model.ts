export interface Usuario {
  idUsuario?: number;
  username: string;
  email: string;
  nombre: string;
  passwordHash?: string;
  rolId: number;
  puntosTotales?: number;
  estado?: boolean;
  padreId?: number;
  createdAt?: string;
}
