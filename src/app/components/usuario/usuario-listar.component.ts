import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import { Usuario } from '../../models/usuario.model';
import { Rol } from '../../models/rol.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-usuario-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './usuario-listar.component.html',
  styleUrl: './usuario-listar.component.css'
})
export class UsuarioListarComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];

  constructor(private svc: UsuarioService, private rolSvc: RolService) {}

  ngOnInit() {
    this.rolSvc.list().subscribe({ next: r => this.roles = r, error: () => {} });
    this.cargar();
  }

  cargar() { this.svc.list().subscribe({ next: d => this.usuarios = d }); }

  nombreRol(id: number) { return this.roles.find(r => r.idRol === id)?.nombre || id; }

  eliminar(id: number) {
    if (confirm('¿Eliminar este usuario?')) this.svc.delete(id).subscribe(() => this.cargar());
  }
}
