export interface Reto {
  idReto?: number;
  titulo: string;
  descripcion?: string;
  tipo: string;
  duracionDias: number;
  dificultad?: string;
  activo?: boolean;
  recompensaId?: number;
  logroId?: number;
}
