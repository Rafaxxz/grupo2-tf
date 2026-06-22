import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UpperCasePipe } from '@angular/common';
import { RecompensaService } from '../../services/recompensa.service';
import { Recompensa } from '../../models/recompensa.model';

@Component({
  selector: 'app-recompensa-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, UpperCasePipe],
  templateUrl: './recompensa-listar.component.html',
  styleUrl: './recompensa-listar.component.css'
})
export class RecompensaListarComponent implements OnInit {
  recompensas: Recompensa[] = [];
  constructor(private svc: RecompensaService) {}
  ngOnInit() { this.cargar(); }
  cargar() { this.svc.list().subscribe({ next: d => this.recompensas = d }); }
  eliminar(id: number) {
    if (confirm('¿Eliminar esta recompensa?'))
      this.svc.delete(id).subscribe(() => this.cargar());
  }
  tipoIcon(tipo: string): string {
    const m: Record<string, string> = { tiempo: '⏰', privilegio: '⭐', virtual: '🎮', fisico: '🎁' };
    return m[tipo] || '🎁';
  }
}
