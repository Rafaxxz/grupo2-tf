import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { RetoUsuarioService } from '../../services/reto-usuario.service';
import { UsuarioService } from '../../services/usuario.service';
import { RetoService } from '../../services/reto.service';
import { RetoUsuario } from '../../models/reto-usuario.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-reto-usuario-listar',
  standalone: true,
  imports: [RouterLink, DatePipe, MatIconModule, TranslatePipe],
  templateUrl: './reto-usuario-listar.component.html',
  styleUrl: './reto-usuario-listar.component.css'
})
export class RetoUsuarioListarComponent implements OnInit {
  items: RetoUsuario[] = [];
  usuarios: any[] = [];
  retos: any[] = [];

  constructor(
    private svc: RetoUsuarioService,
    private usuarioSvc: UsuarioService,
    private retoSvc: RetoService
  ) {}

  ngOnInit() {
    forkJoin({
      usuarios: this.usuarioSvc.list(),
      retos: this.retoSvc.list(),
      items: this.svc.list()
    }).subscribe({
      next: r => { this.usuarios = r.usuarios; this.retos = r.retos; this.items = r.items; },
      error: () => { this.svc.list().subscribe(d => this.items = d); }
    });
  }

  cargar() { this.svc.list().subscribe(d => this.items = d); }
  nombreUsuario(id: number) { return this.usuarios.find(u => u.idUsuario === id)?.nombre || `#${id}`; }
  nombreReto(id: number) { return this.retos.find(r => r.idReto === id)?.titulo || `#${id}`; }

  eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) this.svc.delete(id).subscribe(() => this.cargar());
  }
}
