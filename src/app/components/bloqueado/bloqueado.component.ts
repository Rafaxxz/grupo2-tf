import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LimiteTiempoService } from '../../services/limite-tiempo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bloqueado',
  standalone: true,
  imports: [],
  templateUrl: './bloqueado.component.html',
  styleUrl: './bloqueado.component.css'
})
export class BloqueadoComponent implements OnInit {
  limite: any = null;

  constructor(
    public auth: AuthService,
    private limiteSvc: LimiteTiempoService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.auth.getCurrentUserId();
    this.limiteSvc.getByUsuario(userId).subscribe({
      next: limites => {
        this.limite = limites.find((l: any) => l.bloqueoActivo);
        if (!this.limite) this.router.navigate(['/dashboard']);
      },
      error: () => this.router.navigate(['/dashboard'])
    });
  }

  cerrarSesion() { this.auth.logout(); }
}
