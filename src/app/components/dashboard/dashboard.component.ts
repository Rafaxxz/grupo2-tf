import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { LogroService } from '../../services/logro.service';
import { RecompensaService } from '../../services/recompensa.service';
import { RetoService } from '../../services/reto.service';
import { MensajeService } from '../../services/mensaje.service';
import { ContenidoEducativoService } from '../../services/contenido-educativo.service';
import { CitaEspecialistaService } from '../../services/cita-especialista.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats = { logros: 0, recompensas: 0, retos: 0, mensajes: 0, educacion: 0, citas: 0 };
  loading = true;

  constructor(
    private logroSvc: LogroService,
    private recompensaSvc: RecompensaService,
    private retoSvc: RetoService,
    private mensajeSvc: MensajeService,
    private educativoSvc: ContenidoEducativoService,
    private citaSvc: CitaEspecialistaService
  ) {}

  ngOnInit() {
    forkJoin({
      logros: this.logroSvc.list(),
      recompensas: this.recompensaSvc.list(),
      retos: this.retoSvc.list(),
      mensajes: this.mensajeSvc.list(),
      educacion: this.educativoSvc.list(),
      citas: this.citaSvc.list()
    }).subscribe({
      next: (res) => {
        this.stats.logros = res.logros.length;
        this.stats.recompensas = res.recompensas.length;
        this.stats.retos = res.retos.filter((r: any) => r.activo).length;
        this.stats.mensajes = res.mensajes.filter((m: any) => !m.leido).length;
        this.stats.educacion = res.educacion.length;
        this.stats.citas = res.citas.filter((c: any) => c.estado === 'pendiente').length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
