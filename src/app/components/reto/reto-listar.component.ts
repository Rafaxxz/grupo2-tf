import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RetoService } from '../../services/reto.service';
import { Reto } from '../../models/reto.model';

@Component({
  selector: 'app-reto-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './reto-listar.component.html',
  styleUrl: './reto-listar.component.css'
})
export class RetoListarComponent implements OnInit {
  retos: Reto[] = [];
  constructor(private svc: RetoService) {}
  ngOnInit() { this.cargar(); }
  cargar() { this.svc.list().subscribe({ next: d => this.retos = d }); }
  eliminar(id: number) {
    if (confirm('¿Eliminar este reto?')) this.svc.delete(id).subscribe(() => this.cargar());
  }
  difColor(d: string) { return d === 'fácil' ? '#4eca8b' : d === 'medio' ? '#ff9800' : '#f44336'; }
}
