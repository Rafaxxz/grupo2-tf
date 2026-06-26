import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EspecialistaService } from '../../services/especialista.service';
import { UsuarioService } from '../../services/usuario.service';
import { Especialista } from '../../models/especialista.model';
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

  constructor(private svc: EspecialistaService, private usuarioSvc: UsuarioService, private i18n: TranslateService) {}

  ngOnInit() {
    this.usuarioSvc.list().subscribe(u => {
      this.usuarios = u;
      this.svc.list().subscribe(e => this.especialistas = e);
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
