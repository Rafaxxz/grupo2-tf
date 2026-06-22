import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EspecialistaService } from '../../services/especialista.service';
import { UsuarioService } from '../../services/usuario.service';
import { Especialista } from '../../models/especialista.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-especialista-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './especialista-form.component.html',
  styleUrl: './especialista-form.component.css'
})
export class EspecialistaFormComponent implements OnInit {
  especialista: Especialista = { usuarioId: 0, especialidad: '', modalidad: 'virtual', verificado: false };
  editando = false;
  id?: number;
  usuarios: any[] = [];

  constructor(private svc: EspecialistaService, private usuarioSvc: UsuarioService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.usuarioSvc.list().subscribe(u => this.usuarios = u);
    this.id = this.route.snapshot.params['id'];
    if (this.id) { this.editando = true; this.svc.getById(this.id).subscribe(d => this.especialista = d); }
  }

  guardar() {
    const obs = this.editando ? this.svc.update(this.id!, this.especialista) : this.svc.insert(this.especialista);
    obs.subscribe(() => this.router.navigate(['/especialistas']));
  }
}
