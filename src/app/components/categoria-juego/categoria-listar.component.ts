import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CategoriaJuegoService } from '../../services/categoria-juego.service';
import { CategoriaJuego } from '../../models/categoria-juego.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-categoria-listar',
  standalone: true,
  imports: [FormsModule, MatIconModule, TranslatePipe],
  templateUrl: './categoria-listar.component.html',
  styleUrl: './categoria-listar.component.css'
})
export class CategoriaListarComponent implements OnInit {
  categorias: CategoriaJuego[] = [];
  nueva: CategoriaJuego = { nombre: '' };

  constructor(private svc: CategoriaJuegoService) {}

  ngOnInit() { this.cargar(); }
  cargar() { this.svc.list().subscribe({ next: d => this.categorias = d }); }

  agregar() {
    if (!this.nueva.nombre.trim()) return;
    this.svc.insert(this.nueva).subscribe(() => {
      this.nueva = { nombre: '' };
      this.cargar();
    });
  }
}
