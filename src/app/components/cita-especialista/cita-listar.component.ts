import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { CitaEspecialistaService } from '../../services/cita-especialista.service';
import { EspecialistaService } from '../../services/especialista.service';
import { UsuarioService } from '../../services/usuario.service';
import { CitaEspecialista } from '../../models/cita-especialista.model';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-cita-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, DatePipe, TranslatePipe],
  templateUrl: './cita-listar.component.html',
  styleUrl: './cita-listar.component.css'
})
export class CitaListarComponent implements OnInit {
  citas: CitaEspecialista[] = [];
  usuarios: any[] = [];
  especialistas: any[] = [];

  constructor(
    private svc: CitaEspecialistaService,
    private espSvc: EspecialistaService,
    private usuarioSvc: UsuarioService,
    private i18n: TranslateService
  ) {}

  ngOnInit() {
    this.usuarioSvc.list().subscribe(u => this.usuarios = u);
    this.espSvc.list().subscribe(e => this.especialistas = e);
    this.cargar();
  }

  cargar() { this.svc.list().subscribe({ next: d => this.citas = d }); }

  nombreUsuario(id: number) { return this.usuarios.find(u => u.idUsuario === id)?.nombre || `Usuario ${id}`; }
  nombreEsp(id: number) {
    const e = this.especialistas.find(x => x.idEspecialista === id);
    if (!e) return `Especialista ${id}`;
    return this.usuarios.find(u => u.idUsuario === e.usuarioId)?.nombre || `Especialista ${id}`;
  }

  cambiarEstado(cita: CitaEspecialista, estado: string) {
    this.svc.update(cita.idCita!, { ...cita, estado }).subscribe(() => this.cargar());
  }

  eliminar(id: number) {
    if (confirm(this.i18n.t('common.confirmDelete'))) this.svc.delete(id).subscribe(() => this.cargar());
  }
}
