import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { LimiteTiempoService } from '../../services/limite-tiempo.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-bloqueado',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './bloqueado.component.html',
  styleUrl: './bloqueado.component.css'
})
export class BloqueadoComponent implements OnInit, OnDestroy {
  limite: any  = null;
  remoto       = false;   // bloqueado por el padre via agente
  private poll: any;

  constructor(
    public auth: AuthService,
    private limiteSvc: LimiteTiempoService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.auth.getCurrentUserId();

    // 1. Verificar si hay bloqueo remoto activo
    fetch(`${environment.base}/api/actividad/estado/${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d.bloqueado) {
          this.remoto = true;
          this.iniciarPollingDesbloqueo(userId);
        } else {
          // Sin bloqueo remoto → verificar límite de tiempo en DB
          this.verificarLimiteDB(userId);
        }
      })
      .catch(() => this.verificarLimiteDB(userId));
  }

  ngOnDestroy() { clearInterval(this.poll); }

  private verificarLimiteDB(userId: number) {
    this.limiteSvc.getByUsuario(userId).subscribe({
      next: limites => {
        this.limite = limites.find((l: any) => l.bloqueoActivo);
        if (!this.limite) this.router.navigate(['/dashboard']);
      },
      error: () => this.router.navigate(['/dashboard'])
    });
  }

  private iniciarPollingDesbloqueo(userId: number) {
    this.poll = setInterval(() => {
      fetch(`${environment.base}/api/actividad/estado/${userId}`)
        .then(r => r.json())
        .then(d => {
          if (!d.bloqueado) {
            clearInterval(this.poll);
            this.router.navigate(['/dashboard']);
          }
        })
        .catch(() => {});
    }, 5000);
  }

  cerrarSesion() { this.auth.logout(); }
}
