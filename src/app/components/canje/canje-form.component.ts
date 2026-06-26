import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CanjeRecompensaService } from '../../services/canje-recompensa.service';
import { RecompensaService } from '../../services/recompensa.service';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslateService } from '../../i18n/translate.service';

@Component({
  selector: 'app-canje-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './canje-form.component.html',
  styleUrl: './canje-form.component.css'
})
export class CanjeFormComponent implements OnInit {
  recompensaId = 0;
  recompensas: any[] = [];
  error = '';
  guardando = false;

  // US60: modal de confirmación
  showModal = false;
  recompensaSeleccionada: any = null;

  constructor(
    private svc: CanjeRecompensaService,
    private recompensaSvc: RecompensaService,
    public auth: AuthService,
    private i18n: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.recompensaSvc.list().subscribe({ next: r => this.recompensas = r, error: () => {} });
  }

  confirmar() {
    if (!this.recompensaId) {
      this.error = this.i18n.t('canjes.errSelecciona');
      return;
    }
    this.recompensaSeleccionada = this.recompensas.find(r => r.idRecompensa === Number(this.recompensaId));
    this.error = '';
    this.showModal = true;
  }

  cancelar() {
    this.showModal = false;
  }

  canjear() {
    this.guardando = true;
    this.error = '';
    const dto = {
      usuarioId: this.auth.getCurrentUserId(),
      recompensaId: Number(this.recompensaId)
    };
    this.svc.insert(dto as any).subscribe({
      next: () => this.router.navigate(['/canjes']),
      error: (e: any) => {
        this.error = e.error?.message || this.i18n.t('canjes.errCanjear');
        this.guardando = false;
        this.showModal = false;
      }
    });
  }
}
