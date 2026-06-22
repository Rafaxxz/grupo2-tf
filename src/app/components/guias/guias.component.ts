import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ContenidoEducativoService } from '../../services/contenido-educativo.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-guias',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './guias.component.html',
  styleUrl: './guias.component.css'
})
export class GuiasComponent implements OnInit {
  todos: any[] = [];
  categorias = ['todos', 'guia', 'articulo', 'video', 'podcast'];
  categoriaActiva = 'todos';

  get filtrados() {
    if (this.categoriaActiva === 'todos') return this.todos;
    return this.todos.filter(c => c.tipo === this.categoriaActiva);
  }

  constructor(private svc: ContenidoEducativoService, public auth: AuthService) {}

  ngOnInit() {
    this.svc.list().subscribe({ next: d => this.todos = d });
  }

  tipoIcon(tipo: string) {
    const m: Record<string, string> = {
      video: '🎬', articulo: '📄', guia: '📋', podcast: '🎙️'
    };
    return m[tipo] || '📚';
  }

  tipoLabel(tipo: string) {
    const m: Record<string, string> = {
      video: 'Video', articulo: 'Artículo', guia: 'Guía', podcast: 'Podcast', todos: 'Todos'
    };
    return m[tipo] || tipo;
  }
}
