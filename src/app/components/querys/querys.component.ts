import { Component, OnInit, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { ReporteService, Conteo } from '../../services/reporte.service';

interface Card {
  titulo: string;
  icono: string;
  tipo: ChartType;
  data: ChartData | null;
}

@Component({
  selector: 'app-querys',
  standalone: true,
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './querys.component.html',
  styleUrl: './querys.component.css'
})
export class QuerysComponent implements OnInit {
  cards = signal<Card[]>([]);
  opciones: ChartOptions = { responsive: true, maintainAspectRatio: false };

  private palette = ['#1e3a5f', '#2c7be5', '#00b8a9', '#f6c343', '#e63757',
                     '#6b5b95', '#39afd1', '#fd7e14', '#2dce89', '#8965e0'];

  constructor(private rs: ReporteService) {}

  ngOnInit() {
    const defs: { titulo: string; icono: string; tipo: ChartType; fuente: Observable<Conteo[]> }[] = [
      { titulo: 'Usuarios por rol',            icono: 'group',        tipo: 'bar',      fuente: this.rs.usuariosPorRol() },
      { titulo: 'Especialistas por modalidad', icono: 'verified',     tipo: 'pie',      fuente: this.rs.especialistasPorModalidad() },
      { titulo: 'Juegos por categoría',        icono: 'sports_esports', tipo: 'bar',    fuente: this.rs.juegosPorCategoria() },
      { titulo: 'Minutos jugados por usuario', icono: 'timer',        tipo: 'bar',      fuente: this.rs.minutosPorUsuario() },
      { titulo: 'Recompensas más canjeadas',   icono: 'redeem',       tipo: 'bar',      fuente: this.rs.recompensasMasCanjeadas() },
      { titulo: 'Logros más desbloqueados',    icono: 'emoji_events', tipo: 'bar',      fuente: this.rs.logrosMasDesbloqueados() },
      { titulo: 'Citas por estado',            icono: 'event',        tipo: 'doughnut', fuente: this.rs.citasPorEstado() },
      { titulo: 'Contenido educativo por tipo',icono: 'menu_book',    tipo: 'pie',      fuente: this.rs.contenidoPorTipo() },
    ];

    this.cards.set(defs.map(d => ({ titulo: d.titulo, icono: d.icono, tipo: d.tipo, data: null })));

    defs.forEach((d, i) => d.fuente.subscribe(rows => {
      const card: Card = {
        titulo: d.titulo,
        icono: d.icono,
        tipo: d.tipo,
        data: {
          labels: rows.map(r => r.etiqueta),
          datasets: [{ data: rows.map(r => r.valor), label: d.titulo, backgroundColor: this.palette }]
        }
      };
      this.cards.update(list => list.map((c, idx) => idx === i ? card : c));
    }));
  }
}
