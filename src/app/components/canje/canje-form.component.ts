import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CanjeRecompensaService } from '../../services/canje-recompensa.service';
import { UsuarioService } from '../../services/usuario.service';
import { RecompensaService } from '../../services/recompensa.service';
import { CanjeRecompensa } from '../../models/canje-recompensa.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-canje-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './canje-form.component.html',
  styleUrl: './canje-form.component.css'
})
export class CanjeFormComponent implements OnInit {
  canje: CanjeRecompensa = { usuarioId: 0, recompensaId: 0 };
  usuarios: any[] = [];
  recompensas: any[] = [];

  constructor(
    private svc: CanjeRecompensaService,
    private usuarioSvc: UsuarioService,
    private recompensaSvc: RecompensaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioSvc.list().subscribe({ next: u => this.usuarios = u, error: () => {} });
    this.recompensaSvc.list().subscribe({ next: r => this.recompensas = r, error: () => {} });
  }

  guardar() {
    if (!this.canje.usuarioId || !this.canje.recompensaId) return;
    this.svc.insert(this.canje).subscribe(() => this.router.navigate(['/canjes']));
  }
}
