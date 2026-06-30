import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SesionJuegoService } from '../../services/sesion-juego.service';
import { JuegoService } from '../../services/juego.service';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslateService } from '../../i18n/translate.service';

@Component({
  selector: 'app-sesion-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './sesion-form.component.html',
  styleUrl: './sesion-form.component.css'
})
export class SesionFormComponent implements OnInit {
  usuarioId = 0;
  juegoId = 0;
  inicioLocal = '';
  finLocal = '';
  juegos: any[] = [];
  editando = false;
  id?: number;
  error = '';
  guardando = false;

  esHijo = false;

  constructor(
    private svc: SesionJuegoService,
    private juegoSvc: JuegoService,
    public auth: AuthService,
    private i18n: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.esHijo = this.auth.getCurrentRole() === 'HIJO';

    // HIJO: pre-fill con su propio ID y "ahora"
    if (this.esHijo) {
      this.usuarioId = this.auth.getCurrentUserId();
      this.inicioLocal = this.toLocalDatetimeStr(new Date());
    }

    this.juegoSvc.list().subscribe({ next: j => this.juegos = j, error: () => {} });

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.editando = true;
      this.svc.getById(this.id).subscribe(s => {
        this.usuarioId = s.usuarioId;
        this.juegoId = s.juegoId;
        this.inicioLocal = s.inicio ? s.inicio.substring(0, 16) : '';
        this.finLocal = s.fin ? s.fin.substring(0, 16) : '';
      });
    }
  }

  ahora() {
    this.inicioLocal = this.toLocalDatetimeStr(new Date());
  }

  private toLocalDatetimeStr(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  guardar() {
    if (!this.usuarioId || !this.juegoId || !this.inicioLocal) {
      this.error = this.i18n.t('sesiones.errCampos');
      return;
    }
    this.error = '';
    this.guardando = true;

    const body = {
      usuarioId: Number(this.usuarioId),
      juegoId: Number(this.juegoId),
      inicio: new Date(this.inicioLocal).toISOString(),
      fin: this.finLocal ? new Date(this.finLocal).toISOString() : null
    };

    const obs = this.editando
      ? this.svc.update(this.id!, body as any)
      : this.svc.insert(body as any);

    obs.subscribe({
      next: () => this.router.navigate(['/sesiones']),
      error: (e: any) => {
        this.error = e.error?.message || this.i18n.t('sesiones.errGuardar');
        this.guardando = false;
      }
    });
  }
}
