import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RecompensaService } from '../../services/recompensa.service';
import { Recompensa } from '../../models/recompensa.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-recompensa-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './recompensa-form.component.html',
  styleUrl: './recompensa-form.component.css'
})
export class RecompensaFormComponent implements OnInit {
  recompensa: Recompensa = { nombre: '', descripcion: '', tipo: 'tiempo', costoPuntos: 50, recursoUrl: '' };
  editando = false;
  id?: number;
  tipos = ['tiempo', 'privilegio', 'virtual', 'fisico'];

  constructor(private svc: RecompensaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) { this.editando = true; this.svc.getById(this.id).subscribe(d => this.recompensa = d); }
  }

  guardar() {
    const obs = this.editando ? this.svc.update(this.recompensa) : this.svc.insert(this.recompensa);
    obs.subscribe(() => this.router.navigate(['/recompensas']));
  }
}
