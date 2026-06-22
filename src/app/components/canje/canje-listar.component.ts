import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { CanjeRecompensaService } from '../../services/canje-recompensa.service';
import { UsuarioService } from '../../services/usuario.service';
import { RecompensaService } from '../../services/recompensa.service';
import { AuthService } from '../../services/auth.service';
import { CanjeRecompensa } from '../../models/canje-recompensa.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-canje-listar',
  standalone: true,
  imports: [RouterLink, DatePipe, MatIconModule, TranslatePipe],
  templateUrl: './canje-listar.component.html',
  styleUrl: './canje-listar.component.css'
})
export class CanjeListarComponent implements OnInit {
  canjes: CanjeRecompensa[] = [];
  usuarios: any[] = [];
  recompensas: any[] = [];

  constructor(
    private svc: CanjeRecompensaService,
    private usuarioSvc: UsuarioService,
    private recompensaSvc: RecompensaService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    forkJoin({
      usuarios: this.usuarioSvc.list(),
      recompensas: this.recompensaSvc.list(),
      canjes: this.svc.list()
    }).subscribe({
      next: r => { this.usuarios = r.usuarios; this.recompensas = r.recompensas; this.canjes = r.canjes; },
      error: () => { this.svc.list().subscribe(d => this.canjes = d); }
    });
  }

  cargar() { this.svc.list().subscribe(d => this.canjes = d); }
  nombreUsuario(id: number) { return this.usuarios.find(u => u.idUsuario === id)?.nombre || `#${id}`; }
  nombreRecompensa(id: number) { return this.recompensas.find(r => r.idRecompensa === id)?.nombre || `#${id}`; }

  eliminar(id: number) {
    if (confirm('¿Eliminar este canje?')) this.svc.delete(id).subscribe(() => this.cargar());
  }
}
