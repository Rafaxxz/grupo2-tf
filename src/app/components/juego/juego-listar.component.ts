import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { JuegoService } from '../../services/juego.service';
import { CategoriaJuegoService } from '../../services/categoria-juego.service';
import { AuthService } from '../../services/auth.service';
import { Juego } from '../../models/juego.model';
import { CategoriaJuego } from '../../models/categoria-juego.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-juego-listar',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './juego-listar.component.html',
  styleUrl: './juego-listar.component.css'
})
export class JuegoListarComponent implements OnInit {
  juegos: Juego[] = [];
  categorias: CategoriaJuego[] = [];
  filtroCategoria = 0;

  constructor(
    private svc: JuegoService,
    private catSvc: CategoriaJuegoService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.catSvc.list().subscribe({ next: c => this.categorias = c, error: () => {} });
    this.cargar();
  }

  cargar() {
    if (this.filtroCategoria) {
      this.svc.porCategoria(this.filtroCategoria).subscribe({ next: d => this.juegos = d, error: () => this.juegos = [] });
    } else {
      this.svc.list().subscribe({ next: d => this.juegos = d });
    }
  }

  nombreCategoria(id?: number) { return this.categorias.find(c => c.idCategoria === id)?.nombre || '—'; }
}
