import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ContenidoEducativoService } from '../../services/contenido-educativo.service';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-guias',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslatePipe],
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
      video: 'movie', articulo: 'article', guia: 'list_alt', podcast: 'mic', todos: 'apps'
    };
    return m[tipo] || 'menu_book';
  }

  tipoLabel(tipo: string) {
    const m: Record<string, string> = {
      video: 'guias.video', articulo: 'guias.articulo', guia: 'guias.guia', podcast: 'guias.podcast', todos: 'guias.all'
    };
    return m[tipo] || tipo;
  }
}
