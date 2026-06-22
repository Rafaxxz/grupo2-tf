import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SesionJuegoService } from '../../services/sesion-juego.service';
import { UsuarioService } from '../../services/usuario.service';
import { JuegoService } from '../../services/juego.service';
import { SesionJuego } from '../../models/sesion-juego.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-sesion-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './sesion-form.component.html',
  styleUrl: './sesion-form.component.css'
})
export class SesionFormComponent implements OnInit {
  usuarioId = 0;
  juegoId = 0;
  inicioLocal = '';
  finLocal = '';
  usuarios: any[] = [];
  juegos: any[] = [];

  constructor(
    private svc: SesionJuegoService,
    private usuarioSvc: UsuarioService,
    private juegoSvc: JuegoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioSvc.list().subscribe({ next: u => this.usuarios = u, error: () => {} });
    this.juegoSvc.list().subscribe({ next: j => this.juegos = j, error: () => {} });
  }

  guardar() {
    if (!this.usuarioId || !this.juegoId || !this.inicioLocal) return;
    const sesion: SesionJuego = {
      usuarioId: this.usuarioId,
      juegoId: this.juegoId,
      inicio: new Date(this.inicioLocal).toISOString(),
      fin: this.finLocal ? new Date(this.finLocal).toISOString() : undefined
    };
    this.svc.insert(sesion).subscribe(() => this.router.navigate(['/sesiones']));
  }
}
