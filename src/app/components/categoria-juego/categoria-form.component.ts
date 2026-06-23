import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CategoriaJuegoService } from '../../services/categoria-juego.service';
import { CategoriaJuego } from '../../models/categoria-juego.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.css'
})
export class CategoriaFormComponent implements OnInit {
  categoria: CategoriaJuego = { nombre: '' };
  editando = false;
  id?: number;

  constructor(private svc: CategoriaJuegoService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) { this.editando = true; this.svc.getById(this.id).subscribe(d => this.categoria = d); }
  }

  guardar() {
    if (!this.categoria.nombre.trim()) return;
    const obs = this.editando ? this.svc.update(this.id!, this.categoria) : this.svc.insert(this.categoria);
    obs.subscribe(() => this.router.navigate(['/categorias']));
  }
}
