import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-rol-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './rol-form.component.html',
  styleUrl: './rol-form.component.css'
})
export class RolFormComponent implements OnInit {
  rol: Rol = { nombre: '' };
  editando = false;
  id?: number;

  constructor(private svc: RolService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) { this.editando = true; this.svc.getById(this.id).subscribe(d => this.rol = d); }
  }

  guardar() {
    const obs = this.editando ? this.svc.update(this.id!, this.rol) : this.svc.insert(this.rol);
    obs.subscribe(() => this.router.navigate(['/roles']));
  }
}
