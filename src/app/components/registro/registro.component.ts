import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslateService } from '../../i18n/translate.service';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  username = '';
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  rolId: number | null = null;

  roles: Rol[] = [];
  error = '';
  guardando = false;

  constructor(
    private usuarioSvc: UsuarioService,
    private rolSvc: RolService,
    private router: Router,
    private i18n: TranslateService
  ) {}

  ngOnInit() {
    this.rolSvc.list().subscribe({
      next: roles => this.roles = roles.filter(r => r.nombre !== 'ADMIN'),
      error: () => this.error = this.i18n.t('registro.errRoles')
    });
  }

  registrar() {
    if (!this.username.trim()) { this.error = this.i18n.t('registro.errUsername'); return; }
    if (!this.nombre.trim())   { this.error = this.i18n.t('registro.errNombre');   return; }
    if (!this.email.trim())    { this.error = this.i18n.t('registro.errEmail');    return; }
    if (!this.password)        { this.error = this.i18n.t('registro.errPassword'); return; }
    if (this.password !== this.confirmPassword) { this.error = this.i18n.t('registro.errConfirm'); return; }
    if (!this.rolId)           { this.error = this.i18n.t('registro.errRol');      return; }

    this.error = '';
    this.guardando = true;

    this.usuarioSvc.insert({
      username: this.username.trim(),
      nombre: this.nombre.trim(),
      email: this.email.trim(),
      passwordHash: this.password,
      rolId: Number(this.rolId),
      estado: true
    }).subscribe({
      next: () => this.router.navigate(['/login'], { queryParams: { registrado: '1' } }),
      error: (e: any) => {
        this.error = e.error?.message || this.i18n.t('registro.errGeneral');
        this.guardando = false;
      }
    });
  }
}
