import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CategoriaJuegoService } from '../../services/categoria-juego.service';
import { CategoriaJuego } from '../../models/categoria-juego.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-categoria-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './categoria-listar.component.html',
  styleUrl: './categoria-listar.component.css'
})
export class CategoriaListarComponent implements OnInit {
  categorias: CategoriaJuego[] = [];

  constructor(private svc: CategoriaJuegoService) {}

  ngOnInit() { this.cargar(); }

  cargar() { this.svc.list().subscribe({ next: d => this.categorias = d }); }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta categoría?')) this.svc.delete(id).subscribe(() => this.cargar());
  }
}
