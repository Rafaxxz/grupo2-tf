import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';
import { LogroService } from '../../services/logro.service';
import { LogroUsuarioService } from '../../services/logro-usuario.service';
import { AuthService } from '../../services/auth.service';
import { Logro } from '../../models/logro.model';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

interface LogroConEstado extends Logro {
  desbloqueado: boolean;
  desbloqueadoEn?: string;
}

@Component({
  selector: 'app-logro-listar',
  standalone: true,
  imports: [RouterLink, SlicePipe, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './logro-listar.component.html',
  styleUrl: './logro-listar.component.css'
})
export class LogroListarComponent implements OnInit {
  logros: LogroConEstado[] = [];
  esHijo = false;

  constructor(
    private logroService: LogroService,
    private logroUsuarioSvc: LogroUsuarioService,
    public auth: AuthService,
    private i18n: TranslateService
  ) {}

  ngOnInit() {
    this.esHijo = this.auth.isHijo();
    const userId = this.auth.getCurrentUserId();

    if (this.esHijo && userId) {
      forkJoin({
        todos: this.logroService.list(),
        mios: this.logroUsuarioSvc.porUsuario(userId)
      }).subscribe({
        next: ({ todos, mios }) => {
          const desbloqueadosIds = new Set(mios.map((lu: any) => lu.logroId ?? lu.logro?.idLogro));
          const fechaMap = new Map(mios.map((lu: any) => [
            lu.logroId ?? lu.logro?.idLogro,
            lu.desbloqueadoEn
          ]));
          this.logros = todos.map(l => ({
            ...l,
            desbloqueado: desbloqueadosIds.has(l.idLogro),
            desbloqueadoEn: fechaMap.get(l.idLogro)
          }));
        },
        error: () => this.logroService.list().subscribe(d => {
          this.logros = d.map(l => ({ ...l, desbloqueado: false }));
        })
      });
    } else {
      this.logroService.list().subscribe({
        next: data => this.logros = data.map(l => ({ ...l, desbloqueado: false }))
      });
    }
  }

  eliminar(id: number) {
    if (confirm(this.i18n.t('logros.confirm')))
      this.logroService.delete(id).subscribe(() =>
        this.logros = this.logros.filter(l => l.idLogro !== id)
      );
  }

  get desbloqueados() { return this.logros.filter(l => l.desbloqueado).length; }
}
