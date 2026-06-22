import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/usuario.service';
import { LimiteTiempoService } from '../../services/limite-tiempo.service';
import { AlertaService } from '../../services/alerta.service';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-control-parental',
  standalone: true,
  imports: [FormsModule, MatIconModule, TranslatePipe],
  templateUrl: './control-parental.component.html',
  styleUrl: './control-parental.component.css'
})
export class ControlParentalComponent implements OnInit {
  usuarios: any[] = [];
  limites: any[] = [];
  form = { usuarioId: 0, tipo: 'diario', minutosMaximos: 120, bloqueoActivo: false, notificar: true };
  exito = '';
  error = '';

  constructor(
    private usuarioSvc: UsuarioService,
    private limiteSvc: LimiteTiempoService,
    private alertaSvc: AlertaService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const miId = this.auth.getCurrentUserId();
    this.usuarioSvc.list().subscribe({
      next: u => {
        this.usuarios = u.filter((x: any) => x.idUsuario !== miId);
        // Cargar límites de cada usuario hijo
        this.usuarios.forEach(u => this.cargarLimitesDeUsuario(u.idUsuario));
      },
      error: () => this.error = 'No se pudieron cargar los usuarios'
    });
    if (this.auth.isAdmin()) {
      this.limiteSvc.list().subscribe({ next: l => this.limites = l, error: () => {} });
    }
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
