import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { AlertaService } from '../../services/alerta.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  alertasNoLeidas = 0;

  constructor(public auth: AuthService, private alertaSvc: AlertaService) {}

  ngOnInit() {
    this.cargarAlertas();
  }

  cargarAlertas() {
    const userId = this.auth.getCurrentUserId();
    this.alertaSvc.getByUsuario(userId).subscribe({
      next: alertas => {
        this.alertasNoLeidas = alertas.filter((a: any) => !a.leida).length;
      },
      error: () => { this.alertasNoLeidas = 0; }
    });
  }
}
