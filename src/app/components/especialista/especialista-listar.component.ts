import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EspecialistaService } from '../../services/especialista.service';
import { UsuarioService } from '../../services/usuario.service';
import { Especialista } from '../../models/especialista.model';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-especialista-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './especialista-listar.component.html',
  styleUrl: './especialista-listar.component.css'
})
export class EspecialistaListarComponent implements OnInit {
  especialistas: Especialista[] = [];
  usuarios: any[] = [];

  constructor(private svc: EspecialistaService, private usuarioSvc: UsuarioService, public auth: AuthService, private i18n: TranslateService) {}

  ngOnInit() {
    // Los especialistas se cargan siempre; los nombres se resuelven según el rol
    this.svc.list().subscribe(e => {
      this.especialistas = e;
      if (this.auth.isAdmin()) {
        this.usuarioSvc.list().subscribe(u => this.usuarios = u);
      } else {
        // PADRE/HIJO: usuarioSvc.list() es admin-only; resolvemos cada nombre por ID
        e.forEach(esp => this.usuarioSvc.getById((esp as any).usuarioId).subscribe(u => {
          if (u && !this.usuarios.find(x => x.idUsuario === u.idUsuario)) this.usuarios.push(u);
        }));
      }
    });
  }

  nombreUsuario(id: number) {
    return this.usuarios.find(u => u.idUsuario === id)?.nombre || `Especialista ${id}`;
  }

  eliminar(id: number) {
    if (confirm(this.i18n.t('especialistas.confirm')))
      this.svc.delete(id).subscribe(() => this.svc.list().subscribe(e => this.especialistas = e));
  }
}
