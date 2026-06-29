import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LogroService } from '../../services/logro.service';
import { RecompensaService } from '../../services/recompensa.service';
import { RetoService } from '../../services/reto.service';
import { MensajeService } from '../../services/mensaje.service';
import { ContenidoEducativoService } from '../../services/contenido-educativo.service';
import { CitaEspecialistaService } from '../../services/cita-especialista.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslatePipe],
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
    // catchError en cada llamada: si un rol no tiene acceso a un dato, no rompe el panel.
    const safe = (o: any) => o.pipe(catchError(() => of([]))) as any;
    forkJoin({
      logros: safe(this.logroSvc.list()),
      recompensas: safe(this.recompensaSvc.list()),
      retos: safe(this.retoSvc.list()),
      mensajes: safe(this.mensajeSvc.list()),
      educacion: safe(this.educativoSvc.list()),
      citas: safe(this.citaSvc.list())
    }).subscribe({
      next: (res: any) => {
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
