import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { timeout, finalize } from 'rxjs';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslateService } from '../../i18n/translate.service';
import { UsuarioService } from '../../services/usuario.service';

const ROLES = [
  { id: 1, nombre: 'PADRE', icon: 'supervisor_account', desc: 'registro.rolPadreDesc' },
  { id: 2, nombre: 'HIJO',  icon: 'sports_esports',    desc: 'registro.rolHijoDesc'  },
];

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  username = '';
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  rolId: number | null = null;

  readonly roles = ROLES;
  error = '';
  guardando = false;

  // Errores inline por campo
  fe: Record<string, string> = {
    username: '', nombre: '', email: '', password: '', confirm: ''
  };

  constructor(
    private usuarioSvc: UsuarioService,
    private router: Router,
    private i18n: TranslateService,
    private zone: NgZone
  ) {}

  validateUsername() {
    const v = this.username.trim();
    if (!v)             this.fe['username'] = 'Requerido';
    else if (v.length < 3)  this.fe['username'] = 'Mínimo 3 caracteres';
    else if (/\s/.test(v))  this.fe['username'] = 'Sin espacios';
    else                    this.fe['username'] = '';
  }

  validateNombre() {
    this.fe['nombre'] = !this.nombre.trim() ? 'Requerido' : '';
  }

  validateEmail() {
    const v = this.email.trim();
    if (!v)                  this.fe['email'] = 'Requerido';
    else if (!v.includes('@') || !v.includes('.')) this.fe['email'] = 'Email inválido';
    else                     this.fe['email'] = '';
  }

  validatePassword() {
    if (!this.password)                this.fe['password'] = 'Requerido';
    else if (this.password.length < 4) this.fe['password'] = 'Mínimo 4 caracteres';
    else                               this.fe['password'] = '';
    // re-validar confirm si ya tiene algo
    if (this.confirmPassword) this.validateConfirm();
  }

  validateConfirm() {
    if (!this.confirmPassword)                   this.fe['confirm'] = 'Requerido';
    else if (this.confirmPassword !== this.password) this.fe['confirm'] = 'Las contraseñas no coinciden';
    else                                         this.fe['confirm'] = '';
  }

  private hayErroresCampos(): boolean {
    this.validateUsername();
    this.validateNombre();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirm();
    return Object.values(this.fe).some(e => !!e);
  }

  registrar() {
    if (this.hayErroresCampos()) {
      this.error = 'Corrige los campos marcados en rojo antes de continuar.';
      return;
    }
    if (!this.rolId) {
      this.error = 'Selecciona si eres PADRE o HIJO.';
      return;
    }

    this.error = '';
    this.guardando = true;

    this.usuarioSvc.insert({
      username: this.username.trim(),
      nombre:   this.nombre.trim(),
      email:    this.email.trim(),
      passwordHash: this.password,
      rolId:    Number(this.rolId),
      estado:   true
    })
    .pipe(
      timeout(8000),
      finalize(() => this.zone.run(() => { this.guardando = false; }))
    )
    .subscribe({
      next: () => {
        this.zone.run(() => this.router.navigate(['/login'], { queryParams: { registrado: '1' } }));
      },
      error: (e: any) => {
        this.zone.run(() => {
          if (e?.name === 'TimeoutError') {
            this.error = 'El servidor tardó demasiado. Intenta de nuevo.';
          } else {
            const msg: string = e?.error?.message ?? '';
            if (msg.includes('username'))     this.fe['username'] = 'Este usuario ya está tomado';
            else if (msg.includes('email'))   this.fe['email']    = 'Este email ya está registrado';
            this.error = msg || 'Error al crear la cuenta. Intenta de nuevo.';
          }
        });
      }
    });
  }
}
