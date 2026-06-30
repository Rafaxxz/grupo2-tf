// Regla de juego permitida que un PADRE asigna a un HIJO.
// Se guarda en el navegador (localStorage) para funcionar sin backend.
export interface GameRule {
  id: string;
  childId: number;          // id del usuario hijo al que aplica
  childName: string;        // nombre del hijo (para mostrar)
  nombre: string;           // nombre del juego
  url: string;              // enlace del juego
  horaInicio: string;       // horario permitido inicio 'HH:mm' (vacío = sin restricción)
  horaFin: string;          // horario permitido fin 'HH:mm'
  minutosMaximos: number;   // minutos por día (0 = sin límite)
  bloqueado: boolean;       // bloqueo manual del padre
}

export type EstadoCode = 'ok' | 'bloqueado' | 'fuera-horario' | 'tiempo-agotado';

export interface EstadoJuego {
  code: EstadoCode;
  minutosRestantes: number; // -1 = ilimitado
}
