import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LogroUsuarioService } from '../../services/logro-usuario.service';
import { UsuarioService } from '../../services/usuario.service';
import { LogroService } from '../../services/logro.service';
import { LogroUsuario } from '../../models/logro-usuario.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-logro-usuario-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './logro-usuario-form.component.html',
  styleUrl: './logro-usuario-form.component.css'
})
export class LogroUsuarioFormComponent implements OnInit {
  item: LogroUsuario = { usuarioId: 0, logroId: 0 };
  usuarios: any[] = [];
  logros: any[] = [];

  constructor(
    private svc: LogroUsuarioService,
    private usuarioSvc: UsuarioService,
    private logroSvc: LogroService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioSvc.list().subscribe({ next: u => this.usuarios = u, error: () => {} });
    this.logroSvc.list().subscribe({ next: l => this.logros = l, error: () => {} });
  }

  guardar() {
    if (!this.item.usuarioId || !this.item.logroId) return;
    this.svc.insert(this.item).subscribe(() => this.router.navigate(['/logros-usuario']));
  }
}
