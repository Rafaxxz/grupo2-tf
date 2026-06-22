export interface Alerta {
  idAlerta?: number;
  usuarioId: number;
  sesionId?: number;
  tipo: string;
  mensaje: string;
  nivel: string;
  emitidaEn?: string;
  leida?: boolean;
}
