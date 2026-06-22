import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { SesionJuegoService } from '../../services/sesion-juego.service';
import { UsuarioService } from '../../services/usuario.service';
import { JuegoService } from '../../services/juego.service';
import { AuthService } from '../../services/auth.service';
import { SesionJuego } from '../../models/sesion-juego.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-sesion-listar',
  standalone: true,
  imports: [RouterLink, DatePipe, MatIconModule, TranslatePipe],
  templateUrl: './sesion-listar.component.html',
  styleUrl: './sesion-listar.component.css'
})
export class SesionListarComponent implements OnInit {
  sesiones: SesionJuego[] = [];
  usuarios: any[] = [];
  juegos: any[] = [];

  constructor(
    private svc: SesionJuegoService,
    private usuarioSvc: UsuarioService,
    private juegoSvc: JuegoService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    forkJoin({
      usuarios: this.usuarioSvc.list(),
      juegos: this.juegoSvc.list(),
      sesiones: this.svc.list()
    }).subscribe({
      next: r => { this.usuarios = r.usuarios; this.juegos = r.juegos; this.sesiones = r.sesiones; },
      error: () => { this.svc.list().subscribe(d => this.sesiones = d); }
    });
  }

  nombreUsuario(id: number) { return this.usuarios.find(u => u.idUsuario === id)?.nombre || `#${id}`; }
  nombreJuego(id: number) { return this.juegos.find(j => j.idJuego === id)?.nombre || `#${id}`; }
}
