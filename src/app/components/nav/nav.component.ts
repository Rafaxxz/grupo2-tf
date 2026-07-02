import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { AlertaService } from '../../services/alerta.service';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslatePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  alertasNoLeidas = signal(0);

  constructor(
    public auth: AuthService,
    public i18n: TranslateService,
    private alertaSvc: AlertaService
  ) {}

  ngOnInit() {
    this.cargarAlertas();
  }

  cargarAlertas() {
    const userId = this.auth.getCurrentUserId();
    this.alertaSvc.getByUsuario(userId).subscribe({
      next: alertas => {
        this.alertasNoLeidas.set(alertas.filter((a: any) => !a.leida).length);
      },
      error: () => { this.alertasNoLeidas.set(0); }
    });
  }
}
