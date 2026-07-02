import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of } from 'rxjs';
import { SesionJuegoService } from '../../services/sesion-juego.service';
import { UsuarioService } from '../../services/usuario.service';
import { JuegoService } from '../../services/juego.service';
import { AuthService } from '../../services/auth.service';
import { FamiliaService } from '../../services/familia.service';
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
  cargando = true;

  constructor(
    private svc: SesionJuegoService,
    private usuarioSvc: UsuarioService,
    private juegoSvc: JuegoService,
    private familiaSvc: FamiliaService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const userId = this.auth.getCurrentUserId();

    if (this.auth.isHijo() && userId) {
      // HIJO: solo sus propias sesiones — no necesita lista de usuarios
      forkJoin({
        sesiones: this.svc.porUsuario(userId),
        juegos: this.juegoSvc.list()
      }).subscribe({
        next: r => { this.sesiones = r.sesiones; this.juegos = r.juegos; this.cargando = false; },
        error: () => this.cargando = false
      });
    } else if (this.auth.isPadre()) {
      // PADRE: sesiones de sus hijos vinculados (monitoreo)
      this.familiaSvc.listarHijos().subscribe({
        next: hijos => {
          this.usuarios = hijos;
          const sesiones$ = hijos.length
            ? forkJoin(hijos.map(h => this.svc.porUsuario(h.idUsuario!)))
            : of([] as SesionJuego[][]);
          forkJoin({ juegos: this.juegoSvc.list(), sesiones: sesiones$ }).subscribe({
            next: r => {
              this.juegos = r.juegos;
              this.sesiones = ([] as SesionJuego[]).concat(...(r.sesiones as SesionJuego[][]));
              this.cargando = false;
            },
            error: () => this.cargando = false
          });
        },
        error: () => this.cargando = false
      });
    } else {
      // ADMIN: todas las sesiones
      forkJoin({
        usuarios: this.usuarioSvc.list(),
        juegos: this.juegoSvc.list(),
        sesiones: this.svc.list()
      }).subscribe({
        next: r => {
          this.usuarios = r.usuarios;
          this.juegos = r.juegos;
          this.sesiones = r.sesiones;
          this.cargando = false;
        },
        error: () => {
          this.svc.list().subscribe(d => { this.sesiones = d; this.cargando = false; });
        }
      });
    }
  }

  nombreUsuario(id: number) {
    if (this.auth.isHijo()) return 'Yo';
    return this.usuarios.find(u => u.idUsuario === id)?.nombre || `#${id}`;
  }

  nombreJuego(id: number) { return this.juegos.find(j => j.idJuego === id)?.nombre || `#${id}`; }

  eliminar(id: number) {
    if (!confirm('¿Eliminar esta sesión?')) return;
    this.svc.delete(id).subscribe(() => this.sesiones = this.sesiones.filter(s => s.idSesion !== id));
  }
}
