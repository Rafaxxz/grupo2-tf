export interface Mensaje {
  idMensaje?: number;
  remitenteId?: number;
  destinatarioId?: number;
  contenido: string;
  contexto?: string;
  enviadoEn?: string;
  leido?: boolean;
}
