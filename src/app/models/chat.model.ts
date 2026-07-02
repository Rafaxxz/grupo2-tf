// Calzan con los DTOs del backend (pe.edu.upc.playcontrol.dtos)

// Request -> POST /api/chatbot/preguntar  (ChatMensajeDTO)
export interface ChatMensaje {
  idUsuario: number;
  mensaje: string;
}

// Response de /api/chatbot/preguntar  (ChatRespuestaDTO)
export interface ChatRespuesta {
  idChat: number;
  pregunta: string;
  respuesta: string;
  rolUsuario: string;
  creadoEn: string;
}

// Item de GET /api/chatbot/historial/{idUsuario}  (ChatHistorialDTO)
export interface ChatHistorial {
  idChat: number;
  usuarioId: number;
  pregunta: string;
  respuesta: string;
  rolUsuario: string;
  creadoEn: string;
}
