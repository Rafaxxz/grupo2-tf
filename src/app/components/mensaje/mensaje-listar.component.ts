import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MensajeService } from '../../services/mensaje.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Mensaje } from '../../models/mensaje.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-mensaje-listar',
  standalone: true,
  imports: [FormsModule, MatIconModule, DatePipe, TranslatePipe],
  templateUrl: './mensaje-listar.component.html',
  styleUrl: './mensaje-listar.component.css'
})
export class MensajeListarComponent implements OnInit {
  mensajes: Mensaje[] = [];
  usuarios: any[] = [];
  seleccionado: number | null = null;
  nuevoMensaje = '';
  miId: number;

  get conversacion() {
    if (!this.seleccionado) return [];
    return this.mensajes.filter(m =>
      (m.remitenteId === this.miId && m.destinatarioId === this.seleccionado) ||
      (m.remitenteId === this.seleccionado && m.destinatarioId === this.miId)
    ).sort((a, b) => new Date(a.enviadoEn!).getTime() - new Date(b.enviadoEn!).getTime());
  }

  get contactos() {
    const ids = new Set<number>();
    this.mensajes.forEach(m => {
      if (m.remitenteId !== this.miId) ids.add(m.remitenteId!);
      if (m.destinatarioId !== this.miId) ids.add(m.destinatarioId!);
    });
    return this.usuarios.filter(u => ids.has(u.idUsuario));
  }

  nombreUsuario(id: number) {
    return this.usuarios.find(u => u.idUsuario === id)?.nombre || `Usuario ${id}`;
  }

  constructor(
    private mensajeSvc: MensajeService,
    private usuarioSvc: UsuarioService,
    private auth: AuthService
  ) {
    this.miId = this.auth.getCurrentUserId();
  }

  ngOnInit() {
    this.mensajeSvc.list().subscribe(d => {
      this.mensajes = d;
      if (this.contactos.length) this.seleccionado = this.contactos[0].idUsuario;
    });
    this.usuarioSvc.list().subscribe(d => this.usuarios = d);
  }

  enviar() {
    if (!this.nuevoMensaje.trim() || !this.seleccionado) return;
    const m: Mensaje = {
      remitenteId: this.miId,
      destinatarioId: this.seleccionado,
      contenido: this.nuevoMensaje,
      contexto: 'familiar',
      leido: false
    };
    this.mensajeSvc.insert(m).subscribe(() => {
      this.nuevoMensaje = '';
      this.mensajeSvc.list().subscribe(d => this.mensajes = d);
    });
  }
}
