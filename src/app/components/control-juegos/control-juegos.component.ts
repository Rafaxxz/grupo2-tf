import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/usuario.service';
import { GameControlService } from '../../services/game-control.service';
import { GameRule } from '../../models/game-rule.model';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-control-juegos',
  standalone: true,
  imports: [FormsModule, MatIconModule, TranslatePipe],
  templateUrl: './control-juegos.component.html',
  styleUrl: './control-juegos.component.css'
})
export class ControlJuegosComponent implements OnInit {
  reglas: GameRule[] = [];
  hijos: any[] = [];
  editando = false;

  form: GameRule = this.vacio();

  constructor(
    private usuarioSvc: UsuarioService,
    private svc: GameControlService,
    public i18n: TranslateService
  ) {}

  ngOnInit() {
    this.cargar();
    // Intentar traer usuarios (rol HIJO) del backend; si no hay, se escribe a mano.
    this.usuarioSvc.list().subscribe({
      next: u => this.hijos = u,
      error: () => this.hijos = []
    });
  }

  vacio(): GameRule {
    return { id: '', childId: 0, childName: '', nombre: '', url: '', horaInicio: '', horaFin: '', minutosMaximos: 60, bloqueado: false };
  }

  cargar() { this.reglas = this.svc.list(); }

  nombreHijo(id: number) { return this.hijos.find(h => Number(h.idUsuario) === Number(id))?.nombre || ''; }

  estadoTexto(r: GameRule): string {
    const code = this.svc.estado(r).code;
    return this.i18n.t('gc.estado.' + code);
  }
  estadoClase(r: GameRule): string {
    return 'estado-' + this.svc.estado(r).code;
  }

  guardar() {
    if (!this.form.nombre.trim() || !this.form.url.trim() || !this.form.childId) {
      alert(this.i18n.t('gc.required'));
      return;
    }
    this.form.childName = this.nombreHijo(this.form.childId) || this.form.childName || `#${this.form.childId}`;
    if (!this.form.id) this.form.id = 'g' + Date.now();
    this.svc.save({ ...this.form, childId: Number(this.form.childId), minutosMaximos: Number(this.form.minutosMaximos) });
    this.cancelar();
    this.cargar();
  }

  editar(r: GameRule) {
    this.form = { ...r };
    this.editando = true;
  }

  cancelar() {
    this.form = this.vacio();
    this.editando = false;
  }

  toggleBloqueo(r: GameRule) { this.svc.toggleBlock(r.id); this.cargar(); }

  eliminar(r: GameRule) {
    if (confirm(this.i18n.t('common.confirmDelete'))) { this.svc.remove(r.id); this.cargar(); }
  }
}
