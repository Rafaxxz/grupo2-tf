import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LogroService } from '../../services/logro.service';
import { Logro } from '../../models/logro.model';

@Component({
  selector: 'app-logro-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule],
  templateUrl: './logro-form.component.html',
  styleUrl: './logro-form.component.css'
})
export class LogroFormComponent implements OnInit {
  logro: Logro = { nombre: '', descripcion: '', iconoUrl: '', puntosOtorgados: 10, criterio: '', valorCriterio: 1 };
  editando = false;
  id?: number;

  constructor(private svc: LogroService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.editando = true;
      this.svc.getById(this.id).subscribe(d => this.logro = d);
    }
  }

  guardar() {
    const obs = this.editando
      ? this.svc.update(this.id!, this.logro)
      : this.svc.insert(this.logro);
    obs.subscribe(() => this.router.navigate(['/logros']));
  }
}
