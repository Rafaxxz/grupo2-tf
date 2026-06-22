export interface SesionJuego {
  idSesion?: number;
  usuarioId: number;
  juegoId: number;
  inicio: string;
  fin?: string;
  duracionMinutos?: number;
  fecha?: string;
}
