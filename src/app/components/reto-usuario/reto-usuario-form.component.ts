import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RetoUsuarioService } from '../../services/reto-usuario.service';
import { UsuarioService } from '../../services/usuario.service';
import { RetoService } from '../../services/reto.service';
import { RetoUsuario } from '../../models/reto-usuario.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-reto-usuario-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './reto-usuario-form.component.html',
  styleUrl: './reto-usuario-form.component.css'
})
export class RetoUsuarioFormComponent implements OnInit {
  item: RetoUsuario = { usuarioId: 0, retoId: 0, completado: false };
  usuarios: any[] = [];
  retos: any[] = [];
  editando = false;
  id?: number;

  constructor(
    private svc: RetoUsuarioService,
    private usuarioSvc: UsuarioService,
    private retoSvc: RetoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioSvc.list().subscribe({ next: u => this.usuarios = u, error: () => {} });
    this.retoSvc.list().subscribe({ next: r => this.retos = r, error: () => {} });
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.editando = true;
      this.svc.getById(this.id).subscribe(d => this.item = d);
    }
  }

  guardar() {
    if (!this.item.usuarioId || !this.item.retoId) return;
    const obs = this.editando ? this.svc.update(this.item) : this.svc.insert(this.item);
    obs.subscribe(() => this.router.navigate(['/retos-usuario']));
  }
}
