import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UpperCasePipe } from '@angular/common';
import { RecompensaService } from '../../services/recompensa.service';
import { Recompensa } from '../../models/recompensa.model';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-recompensa-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, UpperCasePipe, TranslatePipe],
  templateUrl: './recompensa-listar.component.html',
  styleUrl: './recompensa-listar.component.css'
})
export class RecompensaListarComponent implements OnInit {
  recompensas: Recompensa[] = [];
  constructor(private svc: RecompensaService, public auth: AuthService, private i18n: TranslateService) {}
  ngOnInit() { this.cargar(); }
  cargar() { this.svc.list().subscribe({ next: d => this.recompensas = d }); }
  eliminar(id: number) {
    if (confirm(this.i18n.t('recompensas.confirm')))
      this.svc.delete(id).subscribe(() => this.cargar());
  }
  tipoIcon(tipo: string): string {
    const m: Record<string, string> = { tiempo: 'schedule', privilegio: 'star', virtual: 'sports_esports', fisico: 'card_giftcard' };
    return m[tipo] || 'card_giftcard';
  }
}
