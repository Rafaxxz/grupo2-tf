import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/usuario.service';
import { LimiteTiempoService } from '../../services/limite-tiempo.service';
import { AlertaService } from '../../services/alerta.service';
import { AuthService } from '../../services/auth.service';
import { FamiliaService } from '../../services/familia.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-control-parental',
  standalone: true,
  imports: [FormsModule, MatIconModule, TranslatePipe],
  templateUrl: './control-parental.component.html',
  styleUrl: './control-parental.component.css'
})
export class ControlParentalComponent implements OnInit, OnDestroy {
  usuarios: any[] = [];
  limites: any[] = [];
  form = { usuarioId: 0, tipo: 'diario', minutosMaximos: 120, bloqueoActivo: false, notificar: true };
  exito = '';
  error = '';

  // Actividad en vivo: hijoId → { ventana, hora }
  actividad:      Record<number, { ventana: string; hora: string }> = {};
  bloqueado:      Record<number, boolean> = {};
  mensajeTexto:   Record<number, string>  = {};
  private sseSource: EventSource | null = null;
  readonly base = environment.base;

  constructor(
    private usuarioSvc: UsuarioService,
    private limiteSvc: LimiteTiempoService,
    private alertaSvc: AlertaService,
    private familiaSvc: FamiliaService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.iniciarSSE();
    if (this.auth.isPadre()) {
      this.familiaSvc.listarHijos().subscribe({
        next: hijos => {
          this.usuarios = hijos;
          hijos.forEach(h => {
            this.cargarLimitesDeUsuario(h.idUsuario!);
            this.cargarActividad(h.idUsuario!);
          });
        },
        error: () => this.error = 'No se pudieron cargar los hijos vinculados'
      });
    } else if (this.auth.isAdmin()) {
      const miId = this.auth.getCurrentUserId();
      this.usuarioSvc.list().subscribe({
        next: u => {
          this.usuarios = u.filter((x: any) => x.idUsuario !== miId);
          this.usuarios.forEach(u => this.cargarLimitesDeUsuario(u.idUsuario));
        },
        error: () => this.error = 'No se pudieron cargar los usuarios'
      });
      this.limiteSvc.list().subscribe({ next: l => this.limites = l, error: () => {} });
    }
  }

  ngOnDestroy() { this.sseSource?.close(); }

  private iniciarSSE() {
    if (typeof EventSource === 'undefined') return;
    this.sseSource = new EventSource(`${environment.base}/api/actividad/stream`);
    this.sseSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.ventana  !== undefined) this.actividad[data.hijoId] = { ventana: data.ventana, hora: data.hora };
      if (data.bloqueado !== undefined) this.bloqueado[data.hijoId] = data.bloqueado;
    };
  }

  private cargarActividad(hijoId: number) {
    fetch(`${environment.base}/api/actividad/actual/${hijoId}`)
      .then(r => r.json())
      .then(d => { if (d.ventana) this.actividad[hijoId] = d; })
      .catch(() => {});
  }

  descargarAgente(hijoId: number) {
    window.open(`${environment.base}/api/actividad/instalar/${hijoId}`);
  }

  enviarComando(hijoId: number, tipo: string, mensaje = '') {
    fetch(`${environment.base}/api/actividad/comando/${hijoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, mensaje })
    }).then(() => {
      if (tipo === 'BLOQUEAR')   this.bloqueado[hijoId] = true;
      if (tipo === 'DESBLOQUEAR') this.bloqueado[hijoId] = false;
      if (tipo === 'MENSAJE')    this.mensajeTexto[hijoId] = '';
    }).catch(() => {});
  }

  cargarLimitesDeUsuario(userId: number) {
    this.limiteSvc.getByUsuario(userId).subscribe({
      next: l => { this.limites = [...this.limites.filter(x => x.usuarioId !== userId), ...l]; },
      error: () => {}
    });
  }

  nombreUsuario(id: number) {
    return this.usuarios.find(u => u.idUsuario === id)?.nombre || `Usuario ${id}`;
  }

  limiteDeUsuario(id: number): any {
    return this.limites.find(l => l.usuarioId === id);
  }

  horasTexto(min: number) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60), m = min % 60;
    return m ? `${h}h ${m}min` : `${h}h`;
  }

  aplicar() {
    if (!this.form.usuarioId) { this.error = 'Selecciona un usuario'; return; }
    this.error = '';
    const { usuarioId, tipo, minutosMaximos, bloqueoActivo, notificar } = this.form;
    this.limiteSvc.insert(usuarioId, tipo, minutosMaximos, bloqueoActivo, notificar).subscribe({
      next: () => {
        this.exito = `Límite aplicado a ${this.nombreUsuario(usuarioId)}`;
        this.cargarLimitesDeUsuario(usuarioId);
        if (bloqueoActivo) {
          this.enviarAlerta(usuarioId, `Tu cuenta ha sido bloqueada. Límite: ${this.horasTexto(minutosMaximos)} ${tipo}`);
        }
        setTimeout(() => this.exito = '', 3000);
      },
      error: (e: any) => this.error = e.error?.message || 'Error al aplicar el límite'
    });
  }

  toggleBloqueo(limite: any) {
    const nuevoEstado = !limite.bloqueoActivo;
    this.limiteSvc.toggleBloqueo(limite.idLimite, limite.usuarioId, limite.tipo, limite.minutosMaximos, nuevoEstado).subscribe({
      next: () => {
        limite.bloqueoActivo = nuevoEstado;
        const msg = nuevoEstado
          ? 'Tu cuenta ha sido bloqueada por control parental'
          : 'Tu cuenta ha sido desbloqueada';
        this.enviarAlerta(limite.usuarioId, msg);
      },
      error: (e: any) => this.error = e.error?.message || 'Error al cambiar bloqueo'
    });
  }

  private enviarAlerta(usuarioId: number, mensaje: string) {
    const alerta: any = {
      usuario: { idUsuario: usuarioId },
      tipo: 'bloqueo',
      mensaje,
      nivel: 'high',
      leida: false
    };
    this.alertaSvc.insert(alerta).subscribe({ error: () => {} });
  }
}
