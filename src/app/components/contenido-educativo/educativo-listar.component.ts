import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ContenidoEducativoService } from '../../services/contenido-educativo.service';
import { ContenidoEducativo } from '../../models/contenido-educativo.model';

@Component({
  selector: 'app-educativo-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, DatePipe, UpperCasePipe],
  templateUrl: './educativo-listar.component.html',
  styleUrl: './educativo-listar.component.css'
})
export class EducativoListarComponent implements OnInit {
  contenidos: ContenidoEducativo[] = [];
  constructor(private svc: ContenidoEducativoService) {}
  ngOnInit() { this.cargar(); }
  cargar() { this.svc.list().subscribe({ next: d => this.contenidos = d }); }
  eliminar(id: number) {
    if (confirm('¿Eliminar este contenido?')) this.svc.delete(id).subscribe(() => this.cargar());
  }
  tipoIcon(tipo: string) {
    const m: Record<string, string> = { video: '🎬', articulo: '📄', guia: '📋', podcast: '🎙️' };
    return m[tipo] || '📚';
  }
}
