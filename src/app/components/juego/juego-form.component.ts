import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { JuegoService } from '../../services/juego.service';
import { CategoriaJuegoService } from '../../services/categoria-juego.service';
import { Juego } from '../../models/juego.model';
import { CategoriaJuego } from '../../models/categoria-juego.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-juego-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './juego-form.component.html',
  styleUrl: './juego-form.component.css'
})
export class JuegoFormComponent implements OnInit {
  juego: Juego = { nombre: '', plataforma: '', categoriaId: undefined };
  categorias: CategoriaJuego[] = [];

  constructor(private svc: JuegoService, private catSvc: CategoriaJuegoService, private router: Router) {}

  ngOnInit() {
    this.catSvc.list().subscribe({ next: c => this.categorias = c, error: () => {} });
  }

  guardar() {
    if (!this.juego.nombre.trim()) return;
    this.svc.insert(this.juego).subscribe(() => this.router.navigate(['/juegos']));
  }
}
