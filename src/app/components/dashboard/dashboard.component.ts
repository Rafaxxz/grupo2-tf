import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslateService } from '../../i18n/translate.service';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SesionJuegoService } from '../../services/sesion-juego.service';
import { LimiteTiempoService } from '../../services/limite-tiempo.service';
import { LogroService } from '../../services/logro.service';
import { RecompensaService } from '../../services/recompensa.service';
import { RetoService } from '../../services/reto.service';
import { MensajeService } from '../../services/mensaje.service';
import { SesionJuego } from '../../models/sesion-juego.model';

interface DiaBar { label: string; minutos: number; excede: boolean; esHoy: boolean; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Sesión activa
  sesionActiva: SesionJuego | null = null;
  tiempoActivoStr = '';
  private timer: any;

  // Gráfico
  dias: DiaBar[] = [];
  limiteDiario: number | null = null;
  maxMinutos = 0;
  vista: 'semana' | 'mes' = 'semana';
  totalSemana = 0;
  numSesionesSemana = 0;

  // Counters
  stats = { logros: 0, recompensas: 0, retos: 0, mensajes: 0 };
  loading = true;
  cargandoSesiones = true;

  private readonly DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  private readonly MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  constructor(
    public auth: AuthService,
    private sesionSvc: SesionJuegoService,
    private limiteSvc: LimiteTiempoService,
    private logroSvc: LogroService,
    private recompensaSvc: RecompensaService,
    private retoSvc: RetoService,
    private mensajeSvc: MensajeService,
    private i18n: TranslateService
  ) {}

  ngOnInit() {
    this.cargarGrafico();
    this.cargarStats();
  }

  ngOnDestroy() { clearInterval(this.timer); }

  cambiarVista(v: 'semana' | 'mes') {
    this.vista = v;
    this.cargarGrafico();
  }

  cargarGrafico() {
    const userId = this.auth.getCurrentUserId();
    this.cargandoSesiones = true;
    forkJoin({
      sesiones: this.sesionSvc.porUsuario(userId),
      limites: this.limiteSvc.getByUsuario(userId)
    }).subscribe({
      next: ({ sesiones, limites }) => {
        this.limiteDiario = limites.find((l: any) => l.tipo === 'diario')?.minutosMaximos ?? null;
        this.sesionActiva = sesiones.find(s => !s.fin) ?? null;
        if (this.sesionActiva) this.iniciarTimer();
        if (this.vista === 'semana') this.procesarSemana(sesiones);
        else this.procesarMes(sesiones);
        this.cargandoSesiones = false;
      },
      error: () => { this.cargandoSesiones = false; }
    });
  }

  private procesarSemana(sesiones: SesionJuego[]) {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7)); // Lunes
    inicioSemana.setHours(0, 0, 0, 0);

    const minPorDia = Array(7).fill(0);
    sesiones.forEach(s => {
      const fecha = new Date(s.inicio);
      const diff = Math.floor((fecha.getTime() - inicioSemana.getTime()) / 86400000);
      if (diff >= 0 && diff < 7 && s.duracionMinutos) {
        minPorDia[diff] += s.duracionMinutos;
      }
    });

    this.dias = minPorDia.map((min, i) => {
      const d = new Date(inicioSemana);
      d.setDate(inicioSemana.getDate() + i);
      return {
        label: this.DIAS_SEMANA[d.getDay()],
        minutos: min,
        excede: this.limiteDiario !== null && min > this.limiteDiario,
        esHoy: d.toDateString() === hoy.toDateString()
      };
    });

    this.totalSemana = minPorDia.reduce((a, b) => a + b, 0);
    this.numSesionesSemana = sesiones.filter(s => {
      const fecha = new Date(s.inicio);
      return fecha >= inicioSemana && fecha <= hoy;
    }).length;
    this.maxMinutos = Math.max(...minPorDia, this.limiteDiario ?? 0, 30);
  }

  private procesarMes(sesiones: SesionJuego[]) {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = hoy.getMonth();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const minPorDia = Array(diasEnMes).fill(0);

    sesiones.forEach(s => {
      const fecha = new Date(s.inicio);
      if (fecha.getFullYear() === anio && fecha.getMonth() === mes && s.duracionMinutos) {
        minPorDia[fecha.getDate() - 1] += s.duracionMinutos;
      }
    });

    this.dias = minPorDia.map((min, i) => ({
      label: `${i + 1}`,
      minutos: min,
      excede: this.limiteDiario !== null && min > this.limiteDiario,
      esHoy: (i + 1) === hoy.getDate()
    }));
    this.totalSemana = minPorDia.reduce((a, b) => a + b, 0);
    this.numSesionesSemana = sesiones.filter(s => {
      const f = new Date(s.inicio);
      return f.getFullYear() === anio && f.getMonth() === mes;
    }).length;
    this.maxMinutos = Math.max(...minPorDia, this.limiteDiario ?? 0, 30);
  }

  private iniciarTimer() {
    clearInterval(this.timer);
    this.actualizarTimer();
    this.timer = setInterval(() => this.actualizarTimer(), 60000);
  }

  private actualizarTimer() {
    if (!this.sesionActiva) return;
    const inicio = new Date(this.sesionActiva.inicio);
    const diffMs = Date.now() - inicio.getTime();
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    this.tiempoActivoStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  finalizarSesion() {
    if (!this.sesionActiva?.idSesion) return;
    const ahora = new Date().toISOString();
    const actualizada = { ...this.sesionActiva, fin: ahora };
    this.sesionSvc.update(this.sesionActiva.idSesion, actualizada).subscribe({
      next: () => {
        this.sesionActiva = null;
        clearInterval(this.timer);
        this.cargarGrafico();
      }
    });
  }

  barAltura(minutos: number): number {
    if (this.maxMinutos === 0) return 0;
    return Math.round((minutos / this.maxMinutos) * 100);
  }

  limiteLinea(): number {
    if (!this.limiteDiario || this.maxMinutos === 0) return -1;
    return 100 - Math.round((this.limiteDiario / this.maxMinutos) * 100);
  }

  formatMin(min: number): string {
    if (min === 0) return '0m';
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
  }

  private cargarStats() {
    const userId = this.auth.getCurrentUserId();
    forkJoin({
      logros:      this.logroSvc.list(),
      recompensas: this.recompensaSvc.list(),
      retos:       this.retoSvc.list(),
      mensajes:    this.mensajeSvc.getNoLeidos(userId)
    }).subscribe({
      next: res => {
        this.stats.logros      = res.logros.length;
        this.stats.recompensas = res.recompensas.length;
        this.stats.retos       = res.retos.filter((r: any) => r.activo).length;
        this.stats.mensajes    = Array.isArray(res.mensajes) ? res.mensajes.length : 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
