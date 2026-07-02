import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LogroService } from '../../services/logro.service';
import { Logro } from '../../models/logro.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-logro-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './logro-form.component.html',
  styleUrl: './logro-form.component.css'
})
export class LogroFormComponent implements OnInit {
  logro: Logro = { nombre: '', descripcion: '', iconoUrl: '', puntosOtorgados: 10, criterio: '', valorCriterio: 1 };
  editando = false;
  id?: number;
  error = '';
  guardando = false;

  constructor(private svc: LogroService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.editando = true;
      this.svc.getById(this.id).subscribe(d => this.logro = d);
    }
  }

  guardar() {
    if (!this.logro.nombre?.trim()) { this.error = 'El nombre del logro es obligatorio'; return; }
    this.error = '';
    this.guardando = true;
    const obs = this.editando ? this.svc.update(this.logro) : this.svc.insert(this.logro);
    obs.subscribe({
      next: () => this.router.navigate(['/logros']),
      error: (e: any) => { this.error = e.error?.message || 'Error al guardar. Intenta de nuevo.'; this.guardando = false; }
    });
  }
}
