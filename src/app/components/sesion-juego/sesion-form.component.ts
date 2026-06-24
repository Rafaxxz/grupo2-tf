import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  editando = false;
  id?: number;
  error = '';
  guardando = false;

  constructor(
    private svc: SesionJuegoService,
    private usuarioSvc: UsuarioService,
    private juegoSvc: JuegoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioSvc.list().subscribe({ next: u => this.usuarios = u, error: () => {} });
    this.juegoSvc.list().subscribe({ next: j => this.juegos = j, error: () => {} });

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.editando = true;
      this.svc.getById(this.id).subscribe(s => {
        this.usuarioId = s.usuarioId;
        this.juegoId = s.juegoId;
        this.inicioLocal = s.inicio ? s.inicio.substring(0, 16) : '';
        this.finLocal = s.fin ? s.fin.substring(0, 16) : '';
      });
    }
  }

  guardar() {
    const uid = Number(this.usuarioId);
    const jid = Number(this.juegoId);
    if (!uid || !jid || !this.inicioLocal) {
      this.error = 'Completa usuario, juego e inicio';
      return;
    }
    this.error = '';
    this.guardando = true;
    const sesion: SesionJuego = {
      usuarioId: uid,
      juegoId: jid,
      inicio: new Date(this.inicioLocal).toISOString(),
      fin: this.finLocal ? new Date(this.finLocal).toISOString() : undefined
    };
    const obs = this.editando ? this.svc.update(this.id!, sesion) : this.svc.insert(sesion);
    obs.subscribe({
      next: () => this.router.navigate(['/sesiones']),
      error: (e: any) => { this.error = e.error?.message || 'Error al guardar. Intenta de nuevo.'; this.guardando = false; }
    });
  }
}
