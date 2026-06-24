import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CitaEspecialistaService } from '../../services/cita-especialista.service';
import { EspecialistaService } from '../../services/especialista.service';
import { UsuarioService } from '../../services/usuario.service';
import { CitaEspecialista } from '../../models/cita-especialista.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './cita-form.component.html',
  styleUrl: './cita-form.component.css'
})
export class CitaFormComponent implements OnInit {
  cita: CitaEspecialista = { usuarioId: 0, especialistaId: 0, fechaHora: '', estado: 'pendiente' };
  editando = false;
  id?: number;
  usuarios: any[] = [];
  especialistas: any[] = [];
  estados = ['pendiente', 'confirmada', 'completada', 'cancelada'];
  error = '';
  guardando = false;

  constructor(
    private svc: CitaEspecialistaService,
    private espSvc: EspecialistaService,
    private usuarioSvc: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioSvc.list().subscribe(u => this.usuarios = u);
    this.espSvc.list().subscribe(e => this.especialistas = e);
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.editando = true;
      this.svc.getById(this.id).subscribe(d => {
        this.cita = { ...d, fechaHora: d.fechaHora ? d.fechaHora.substring(0, 16) : '' };
      });
    }
  }

  nombreEsp(e: any) {
    return this.usuarios.find(u => u.idUsuario === e.usuarioId)?.nombre || `Especialista ${e.idEspecialista}`;
  }

  guardar() {
    const uid = Number(this.cita.usuarioId);
    const eid = Number(this.cita.especialistaId);
    if (!uid || !eid || !this.cita.fechaHora) {
      this.error = 'Completa todos los campos obligatorios';
      return;
    }
    this.error = '';
    this.guardando = true;
    const payload = { ...this.cita, usuarioId: uid, especialistaId: eid, fechaHora: new Date(this.cita.fechaHora).toISOString() };
    const obs = this.editando ? this.svc.update(this.id!, payload as any) : this.svc.insert(payload as any);
    obs.subscribe({
      next: () => this.router.navigate(['/citas']),
      error: (e: any) => { this.error = e.error?.message || 'Error al guardar la cita'; this.guardando = false; }
    });
  }
}
