import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import { Usuario } from '../../models/usuario.model';
import { Rol } from '../../models/rol.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  usuario: Usuario = { username: '', email: '', nombre: '', passwordHash: '', rolId: 0, puntosTotales: 0, estado: true };
  roles: Rol[] = [];
  editando = false;
  id?: number;

  constructor(
    private svc: UsuarioService,
    private rolSvc: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.rolSvc.list().subscribe({ next: r => this.roles = r, error: () => {} });
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.editando = true;
      this.svc.getById(this.id).subscribe(d => { this.usuario = d; this.usuario.passwordHash = ''; });
    }
  }

  guardar() {
    const obs = this.editando
      ? this.svc.update(this.id!, this.usuario)
      : this.svc.insert(this.usuario);
    obs.subscribe(() => this.router.navigate(['/usuarios']));
  }
}
