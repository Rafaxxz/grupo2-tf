import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { AlertaService } from '../../services/alerta.service';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-alertas-panel',
  standalone: true,
  imports: [MatIconModule, DatePipe, TranslatePipe],
  templateUrl: './alertas-panel.component.html',
  styleUrl: './alertas-panel.component.css'
})
export class AlertasPanelComponent implements OnInit {
  alertas: any[] = [];
  cargando = true;

  constructor(private alertaSvc: AlertaService, public auth: AuthService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando = true;
    const userId = this.auth.getCurrentUserId();
    this.alertaSvc.getByUsuario(userId).subscribe({
      next: alertas => {
        this.alertas = alertas.sort((a: any, b: any) =>
          new Date(b.emitidaEn || 0).getTime() - new Date(a.emitidaEn || 0).getTime());
        this.cargando = false;
      },
      error: () => { this.alertas = []; this.cargando = false; }
    });
  }

  marcarLeida(alerta: any) {
    this.alertaSvc.marcarLeida(alerta.idAlerta).subscribe({
      next: () => { alerta.leida = true; }
    });
  }

  marcarTodasLeidas() {
    const noLeidas = this.alertas.filter(a => !a.leida);
    noLeidas.forEach(a => this.marcarLeida(a));
  }

  sinLeer() { return this.alertas.filter(a => !a.leida).length; }

  nivelColor(nivel: string): string {
    const m: Record<string, string> = {
      warning: '#ff9800', info: '#4eca8b', error: '#f44336', high: '#f44336', medium: '#ff9800', low: '#4eca8b'
    };
    return m[nivel] ?? '#888';
  }

  tipoIcon(tipo: string): string {
    const m: Record<string, string> = {
      limite_excedido: 'timer_off',
      logro_desbloqueado: 'emoji_events',
      bloqueo: 'block',
      warning: 'warning',
      info: 'info'
    };
    return m[tipo] ?? 'notifications';
  }

  tipoLabel(tipo: string): string {
    const m: Record<string, string> = {
      limite_excedido: 'Límite superado',
      logro_desbloqueado: 'Logro desbloqueado',
      bloqueo: 'Sesión bloqueada',
      warning: 'Advertencia',
      info: 'Información'
    };
    return m[tipo] ?? tipo;
  }
}
