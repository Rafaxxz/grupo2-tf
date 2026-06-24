import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RecompensaService } from '../../services/recompensa.service';
import { Recompensa } from '../../models/recompensa.model';

@Component({
  selector: 'app-recompensa-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule],
  templateUrl: './recompensa-form.component.html',
  styleUrl: './recompensa-form.component.css'
})
export class RecompensaFormComponent implements OnInit {
  recompensa: Recompensa = { nombre: '', descripcion: '', tipo: 'tiempo', costoPuntos: 50, recursoUrl: '' };
  editando = false;
  id?: number;
  tipos = ['tiempo', 'privilegio', 'virtual', 'fisico'];
  error = '';
  guardando = false;

  constructor(private svc: RecompensaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) { this.editando = true; this.svc.getById(this.id).subscribe(d => this.recompensa = d); }
  }

  guardar() {
    if (!this.recompensa.nombre?.trim()) { this.error = 'El nombre de la recompensa es obligatorio'; return; }
    this.error = '';
    this.guardando = true;
    const obs = this.editando ? this.svc.update(this.id!, this.recompensa) : this.svc.insert(this.recompensa);
    obs.subscribe({
      next: () => this.router.navigate(['/recompensas']),
      error: (e: any) => { this.error = e.error?.message || 'Error al guardar. Intenta de nuevo.'; this.guardando = false; }
    });
  }
}
