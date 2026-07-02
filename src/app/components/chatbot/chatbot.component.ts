import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatbotService } from '../../services/chatbot.service';
import { AuthService } from '../../services/auth.service';

interface Burbuja {
  from: 'user' | 'ia';
  text: string;
  hora: Date;
  error?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollBox') private scrollBox!: ElementRef<HTMLDivElement>;

  mensajes: Burbuja[] = [];
  entrada = '';
  cargando = false;        // esperando respuesta de la IA
  cargandoHistorial = true;
  private autoScroll = false;

  constructor(private chatSvc: ChatbotService, public auth: AuthService) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  ngAfterViewChecked() {
    if (this.autoScroll) {
      this.scrollAlFinal();
      this.autoScroll = false;
    }
  }

  get rol(): string { return this.auth.getCurrentRole(); }
  get esPadre(): boolean { return this.auth.isPadre(); }
  get esHijo(): boolean { return this.auth.isHijo(); }

  private cargarHistorial() {
    const userId = this.auth.getCurrentUserId();
    this.chatSvc.getHistorial(userId).subscribe({
      next: historial => {
        // Backend lo envía descendente -> lo mostramos cronológico (más antiguo arriba)
        const orden = [...historial].reverse();
        this.mensajes = [];
        for (const h of orden) {
          this.mensajes.push({ from: 'user', text: h.pregunta, hora: new Date(h.creadoEn) });
          this.mensajes.push({ from: 'ia', text: h.respuesta, hora: new Date(h.creadoEn) });
        }
        this.cargandoHistorial = false;
        this.autoScroll = true;
      },
      error: () => { this.mensajes = []; this.cargandoHistorial = false; }
    });
  }

  enviar() {
    const texto = this.entrada.trim();
    if (!texto || this.cargando) return;

    this.mensajes.push({ from: 'user', text: texto, hora: new Date() });
    this.entrada = '';
    this.cargando = true;
    this.autoScroll = true;

    this.chatSvc.preguntar({ idUsuario: this.auth.getCurrentUserId(), mensaje: texto }).subscribe({
      next: res => {
        this.mensajes.push({ from: 'ia', text: res.respuesta, hora: new Date(res.creadoEn) });
        this.cargando = false;
        this.autoScroll = true;
      },
      error: (err: HttpErrorResponse) => {
        let msg = 'Ocurrió un error al contactar al asistente. Intenta de nuevo.';
        if (err.status === 429 || err.status === 503) {
          msg = '⏳ El asistente está muy solicitado en este momento. Intenta de nuevo en unos minutos.';
        } else if (err.error?.message) {
          msg = err.error.message;
        }
        this.mensajes.push({ from: 'ia', text: msg, hora: new Date(), error: true });
        this.cargando = false;
        this.autoScroll = true;
      }
    });
  }

  // Enter envía; Shift+Enter hace salto de línea
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  // Limpia solo la pantalla, NO borra el historial de la base de datos
  limpiarPantalla() {
    this.mensajes = [];
  }

  private scrollAlFinal() {
    try {
      const el = this.scrollBox?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch { /* noop */ }
  }
}
