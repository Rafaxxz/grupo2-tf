import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ContenidoEducativoService } from '../../services/contenido-educativo.service';
import { ContenidoEducativo } from '../../models/contenido-educativo.model';

@Component({
  selector: 'app-educativo-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule],
  templateUrl: './educativo-form.component.html',
  styleUrl: './educativo-form.component.css'
})
export class EducativoFormComponent implements OnInit {
  contenido: ContenidoEducativo = { titulo: '', autor: '', fuente: '', tipo: 'articulo', url: '', contenido: '' };
  editando = false;
  id?: number;
  tipos = ['articulo', 'video', 'guia', 'podcast'];
  error = '';
  guardando = false;

  constructor(private svc: ContenidoEducativoService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) { this.editando = true; this.svc.getById(this.id).subscribe(d => this.contenido = d); }
  }

  urlValida(): boolean {
    try { new URL(this.contenido.url || ''); return true; } catch { return false; }
  }

  probarEnlace() {
    if (this.urlValida()) window.open(this.contenido.url, '_blank', 'noopener');
  }

  guardar() {
    if (!this.contenido.titulo?.trim()) { this.error = 'El título es obligatorio'; return; }
    if (!this.contenido.url?.trim()) { this.error = 'La URL es obligatoria'; return; }
    if (!this.urlValida()) { this.error = 'Ingresa una URL válida (ej: https://ejemplo.com)'; return; }

    this.error = '';
    this.guardando = true;
    const obs = this.editando ? this.svc.update(this.id!, this.contenido) : this.svc.insert(this.contenido);
    obs.subscribe({
      next: () => this.router.navigate(['/educacion']),
      error: (e: any) => { this.error = e.error?.message || 'Error al guardar. Intenta de nuevo.'; this.guardando = false; }
    });
  }
}
