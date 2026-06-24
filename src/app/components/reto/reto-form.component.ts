import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RetoService } from '../../services/reto.service';
import { RecompensaService } from '../../services/recompensa.service';
import { LogroService } from '../../services/logro.service';
import { Reto } from '../../models/reto.model';

@Component({
  selector: 'app-reto-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule],
  templateUrl: './reto-form.component.html',
  styleUrl: './reto-form.component.css'
})
export class RetoFormComponent implements OnInit {
  reto: Reto = { titulo: '', descripcion: '', tipo: 'familiar', duracionDias: 7, dificultad: 'medio', activo: true };
  editando = false;
  id?: number;
  recompensas: any[] = [];
  logros: any[] = [];
  error = '';
  guardando = false;

  constructor(
    private svc: RetoService,
    private recompensaSvc: RecompensaService,
    private logroSvc: LogroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.recompensaSvc.list().subscribe(d => this.recompensas = d);
    this.logroSvc.list().subscribe(d => this.logros = d);
    this.id = this.route.snapshot.params['id'];
    if (this.id) { this.editando = true; this.svc.getById(this.id).subscribe(d => this.reto = d); }
  }

  guardar() {
    if (!this.reto.titulo?.trim()) { this.error = 'El título del reto es obligatorio'; return; }
    this.error = '';
    this.guardando = true;
    const obs = this.editando ? this.svc.update(this.id!, this.reto) : this.svc.insert(this.reto);
    obs.subscribe({
      next: () => this.router.navigate(['/retos']),
      error: (e: any) => { this.error = e.error?.message || 'Error al guardar. Intenta de nuevo.'; this.guardando = false; }
    });
  }
}
