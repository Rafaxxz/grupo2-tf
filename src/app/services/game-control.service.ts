import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GameRule, EstadoJuego } from '../models/game-rule.model';

const RULES_KEY = 'pc_game_rules';
const USAGE_KEY = 'pc_game_usage';

interface Usage { [ruleId: string]: { date: string; minutos: number } }

@Injectable({ providedIn: 'root' })
export class GameControlService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ── Reglas ───────────────────────────────────────────────
  list(): GameRule[] {
    if (!this.isBrowser) return [];
    try { return JSON.parse(localStorage.getItem(RULES_KEY) || '[]'); }
    catch { return []; }
  }

  byChild(childId: number): GameRule[] {
    return this.list().filter(r => Number(r.childId) === Number(childId));
  }

  getById(id: string): GameRule | undefined {
    return this.list().find(r => r.id === id);
  }

  save(rule: GameRule): void {
    if (!this.isBrowser) return;
    const rules = this.list();
    const i = rules.findIndex(r => r.id === rule.id);
    if (i >= 0) rules[i] = rule; else rules.push(rule);
    localStorage.setItem(RULES_KEY, JSON.stringify(rules));
  }

  remove(id: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(RULES_KEY, JSON.stringify(this.list().filter(r => r.id !== id)));
  }

  toggleBlock(id: string): void {
    const rule = this.getById(id);
    if (rule) { rule.bloqueado = !rule.bloqueado; this.save(rule); }
  }

  // ── Uso diario ───────────────────────────────────────────
  private hoy(): string { return new Date().toISOString().substring(0, 10); }

  private usage(): Usage {
    if (!this.isBrowser) return {};
    try { return JSON.parse(localStorage.getItem(USAGE_KEY) || '{}'); }
    catch { return {}; }
  }

  usoHoy(id: string): number {
    const u = this.usage()[id];
    return u && u.date === this.hoy() ? u.minutos : 0;
  }

  sumarMinuto(id: string): void {
    if (!this.isBrowser) return;
    const u = this.usage();
    const actual = u[id] && u[id].date === this.hoy() ? u[id].minutos : 0;
    u[id] = { date: this.hoy(), minutos: actual + 1 };
    localStorage.setItem(USAGE_KEY, JSON.stringify(u));
  }

  reiniciarUso(id: string): void {
    if (!this.isBrowser) return;
    const u = this.usage();
    delete u[id];
    localStorage.setItem(USAGE_KEY, JSON.stringify(u));
  }

  // ── Evaluación ───────────────────────────────────────────
  estado(rule: GameRule): EstadoJuego {
    if (rule.bloqueado) return { code: 'bloqueado', minutosRestantes: 0 };

    if (rule.horaInicio && rule.horaFin) {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const dentro = hhmm >= rule.horaInicio && hhmm <= rule.horaFin;
      if (!dentro) return { code: 'fuera-horario', minutosRestantes: 0 };
    }

    if (rule.minutosMaximos > 0) {
      const restantes = rule.minutosMaximos - this.usoHoy(rule.id);
      if (restantes <= 0) return { code: 'tiempo-agotado', minutosRestantes: 0 };
      return { code: 'ok', minutosRestantes: restantes };
    }

    return { code: 'ok', minutosRestantes: -1 };
  }
}
