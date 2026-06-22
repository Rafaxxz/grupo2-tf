import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ContenidoEducativoService } from '../../services/contenido-educativo.service';
import { ContenidoEducativo } from '../../models/contenido-educativo.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-educativo-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './educativo-form.component.html',
  styleUrl: './educativo-form.component.css'
})
export class EducativoFormComponent implements OnInit {
  contenido: ContenidoEducativo = { titulo: '', autor: '', fuente: '', tipo: 'articulo', url: '', contenido: '' };
  editando = false;
  id?: number;
  tipos = ['articulo', 'video', 'guia', 'podcast'];

  constructor(private svc: ContenidoEducativoService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) { this.editando = true; this.svc.getById(this.id).subscribe(d => this.contenido = d); }
  }

  guardar() {
    const obs = this.editando ? this.svc.update(this.id!, this.contenido) : this.svc.insert(this.contenido);
    obs.subscribe(() => this.router.navigate(['/educacion']));
  }
}
