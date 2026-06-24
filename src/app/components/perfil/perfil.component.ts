import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [DatePipe, MatIconModule, RouterLink, TranslatePipe],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  cargando = true;
  error = '';

  constructor(
    private usuarioSvc: UsuarioService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.usuarioSvc.getMe().subscribe({
      next: u => { this.usuario = u; this.cargando = false; },
      error: () => { this.error = 'No se pudo cargar el perfil.'; this.cargando = false; }
    });
  }

  rolLabel(rolId: number | undefined): string {
    const mapa: Record<number, string> = { 1: 'PADRE', 2: 'HIJO', 3: 'ADMIN' };
    return rolId ? (mapa[rolId] ?? '—') : '—';
  }
}
