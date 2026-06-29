import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { GameControlService } from '../../services/game-control.service';
import { GameRule, EstadoJuego } from '../../models/game-rule.model';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-mis-juegos',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './mis-juegos.component.html',
  styleUrl: './mis-juegos.component.css'
})
export class MisJuegosComponent implements OnInit, OnDestroy {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  reglas: GameRule[] = [];
  childId = 0;

  activeId: string | null = null;
  sessionSecs = 0;
  private timer: any = null;

  constructor(
    private auth: AuthService,
    private svc: GameControlService,
    public i18n: TranslateService
  ) {}

  ngOnInit() {
    this.childId = this.auth.getCurrentUserId();
    this.cargar();
  }

  ngOnDestroy() { this.detener(); }

  cargar() { this.reglas = this.svc.byChild(this.childId); }

  estado(r: GameRule): EstadoJuego { return this.svc.estado(r); }
  estadoTexto(r: GameRule): string { return this.i18n.t('gc.estado.' + this.estado(r).code); }
  jugable(r: GameRule): boolean { return this.estado(r).code === 'ok'; }

  minutosRestantes(r: GameRule): string {
    const e = this.estado(r);
    if (e.minutosRestantes < 0) return this.i18n.t('gc.unlimited');
    return e.minutosRestantes + ' min';
  }

  sessionTime(): string {
    const m = Math.floor(this.sessionSecs / 60);
    const s = this.sessionSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  jugar(r: GameRule) {
    if (!this.isBrowser || !this.jugable(r)) return;
    this.detener();
    this.activeId = r.id;
    this.sessionSecs = 0;
    window.open(r.url, '_blank');
    this.timer = setInterval(() => this.tick(), 1000);
  }

  private tick() {
    if (!this.activeId) return;
    this.sessionSecs++;
    if (this.sessionSecs % 60 === 0) {
      this.svc.sumarMinuto(this.activeId);
    }
    const r = this.svc.getById(this.activeId);
    if (!r || this.svc.estado(r).code !== 'ok') {
      this.detener();
      this.cargar();
    }
  }

  detener() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    this.activeId = null;
    this.sessionSecs = 0;
  }
}
