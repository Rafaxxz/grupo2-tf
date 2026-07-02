export interface LimiteTiempo {
  idLimite?: number;
  usuarioId: number;
  tipo: string;
  minutosMaximos: number;
  bloqueoActivo?: boolean;
  notificar?: boolean;
  actualizadoEn?: string;
}
