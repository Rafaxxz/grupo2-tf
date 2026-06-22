import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { AlertaService } from '../../services/alerta.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-alertas-panel',
  standalone: true,
  imports: [MatIconModule, DatePipe, UpperCasePipe],
  templateUrl: './alertas-panel.component.html',
  styleUrl: './alertas-panel.component.css'
})
export class AlertasPanelComponent implements OnInit {
  alertas: any[] = [];
  cargando = true;

  constructor(private alertaSvc: AlertaService, public auth: AuthService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.alertaSvc.list().subscribe({
      next: a => { this.alertas = a.sort((x: any, y: any) =>
        new Date(y.emitidaEn || 0).getTime() - new Date(x.emitidaEn || 0).getTime());
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  nivelColor(nivel: string) {
    const m: Record<string, string> = { high: '#f44336', medium: '#ff9800', low: '#4caf50' };
    return m[nivel] || '#888';
  }

  tipoIcon(tipo: string) {
    const m: Record<string, string> = {
      bloqueo: 'lock', timeout: 'timer_off', warning: 'warning', info: 'info'
    };
    return m[tipo] || 'notifications';
  }

  sinLeer() { return this.alertas.filter(a => !a.leida).length; }
}
