import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { LogroUsuarioService } from '../../services/logro-usuario.service';
import { UsuarioService } from '../../services/usuario.service';
import { LogroService } from '../../services/logro.service';
import { LogroUsuario } from '../../models/logro-usuario.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-logro-usuario-listar',
  standalone: true,
  imports: [RouterLink, DatePipe, MatIconModule, TranslatePipe],
  templateUrl: './logro-usuario-listar.component.html',
  styleUrl: './logro-usuario-listar.component.css'
})
export class LogroUsuarioListarComponent implements OnInit {
  items: LogroUsuario[] = [];
  usuarios: any[] = [];
  logros: any[] = [];

  constructor(
    private svc: LogroUsuarioService,
    private usuarioSvc: UsuarioService,
    private logroSvc: LogroService
  ) {}

  ngOnInit() {
    forkJoin({
      usuarios: this.usuarioSvc.list(),
      logros: this.logroSvc.list(),
      items: this.svc.list()
    }).subscribe({
      next: r => { this.usuarios = r.usuarios; this.logros = r.logros; this.items = r.items; },
      error: () => { this.svc.list().subscribe(d => this.items = d); }
    });
  }

  cargar() { this.svc.list().subscribe(d => this.items = d); }
  nombreUsuario(id: number) { return this.usuarios.find(u => u.idUsuario === id)?.nombre || `#${id}`; }
  nombreLogro(id: number) { return this.logros.find(l => l.idLogro === id)?.nombre || `#${id}`; }

  eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) this.svc.delete(id).subscribe(() => this.cargar());
  }
}
