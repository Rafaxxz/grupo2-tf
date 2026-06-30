import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslateService } from '../../i18n/translate.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [DatePipe, FormsModule, MatIconModule, RouterLink, TranslatePipe],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  cargando = true;
  error = '';

  // Edit mode
  editando = false;
  editNombre = '';
  editEmail = '';
  editPassword = '';
  editConfirmPassword = '';
  guardando = false;
  editError = '';
  editOk = false;

  constructor(
    private usuarioSvc: UsuarioService,
    public auth: AuthService,
    private i18n: TranslateService
  ) {}

  ngOnInit() {
    this.usuarioSvc.getMe().subscribe({
      next: u => { this.usuario = u; this.cargando = false; },
      error: () => { this.error = this.i18n.t('perfil.errorCarga'); this.cargando = false; }
    });
  }

  iniciarEdicion() {
    if (!this.usuario) return;
    this.editNombre = this.usuario.nombre;
    this.editEmail = this.usuario.email ?? '';
    this.editPassword = '';
    this.editConfirmPassword = '';
    this.editError = '';
    this.editOk = false;
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
    this.editError = '';
  }

  guardar() {
    if (!this.usuario) return;
    if (!this.editNombre.trim()) {
      this.editError = this.i18n.t('perfil.errNombre');
      return;
    }
    if (this.editPassword && this.editPassword !== this.editConfirmPassword) {
      this.editError = this.i18n.t('perfil.errPassNoMatch');
      return;
    }
    this.guardando = true;
    this.editError = '';

    const payload: Usuario = {
      ...this.usuario,
      nombre: this.editNombre.trim(),
      email: this.editEmail.trim(),
      ...(this.editPassword ? { password: this.editPassword } : {})
    };

    this.usuarioSvc.update(this.usuario.idUsuario!, payload).subscribe({
      next: u => {
        this.usuario = u;
        this.editando = false;
        this.editOk = true;
        this.guardando = false;
        setTimeout(() => this.editOk = false, 3000);
      },
      error: (e: any) => {
        this.editError = e.error?.message ?? this.i18n.t('perfil.errGuardar');
        this.guardando = false;
      }
    });
  }
}
