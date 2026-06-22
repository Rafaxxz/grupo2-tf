import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol.model';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-rol-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './rol-listar.component.html',
  styleUrl: './rol-listar.component.css'
})
export class RolListarComponent implements OnInit {
  roles: Rol[] = [];
  constructor(private svc: RolService) {}
  ngOnInit() { this.cargar(); }
  cargar() { this.svc.list().subscribe({ next: d => this.roles = d }); }
  eliminar(id: number) {
    if (confirm('¿Eliminar este rol?')) this.svc.delete(id).subscribe(() => this.cargar());
  }
}
